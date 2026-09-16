"""
SEO audit — `python3 scripts/seo-audit.py` against a running server.

Crawls every URL in the sitemap and reports what a search engine actually sees:
titles and their length, descriptions, canonicals, robots directives, headings,
structured data, image alt text, Open Graph and Twitter cards.

Lengths are measured after decoding HTML entities, because "&#x27;" is one
character to a reader and five to a byte counter — an audit that counts the
escaping reports problems that do not exist.

Read-only. Writes the raw rows to /tmp/seo-report.json for diffing between runs.
"""
import html
import json
import re
import subprocess
from collections import Counter, defaultdict

BASE = "http://127.0.0.1:3000"

sitemap = subprocess.run(
    ["curl", "-s", f"{BASE}/sitemap.xml"], capture_output=True, text=True
).stdout
urls = [u for u in re.findall(r"<loc>([^<]+)</loc>", sitemap)]
paths = [u.replace(u.split("//")[0] + "//" + u.split("//")[1].split("/")[0], "") or "/" for u in urls]


def get(url):
    p = subprocess.run(
        ["curl", "-s", "-w", "\n@@STATUS@@%{http_code}", url],
        capture_output=True,
        text=True,
        timeout=30,
    )
    body, _, status = p.stdout.rpartition("@@STATUS@@")
    return int(status or 0), body


def meta(body, pattern):
    m = re.search(pattern, body, re.S | re.I)
    return html.unescape(re.sub(r"\s+", " ", m.group(1)).strip()) if m else None


rows = []
for path in paths:
    status, body = get(BASE + path)
    title = meta(body, r"<title[^>]*>(.*?)</title>")
    desc = meta(body, r'<meta name="description" content="([^"]*)"')
    canonical = meta(body, r'<link rel="canonical" href="([^"]*)"')
    robots = meta(body, r'<meta name="robots" content="([^"]*)"')
    og_title = meta(body, r'<meta property="og:title" content="([^"]*)"')
    og_desc = meta(body, r'<meta property="og:description" content="([^"]*)"')
    og_url = meta(body, r'<meta property="og:url" content="([^"]*)"')
    og_img = meta(body, r'<meta property="og:image" content="([^"]*)"')
    tw_card = meta(body, r'<meta name="twitter:card" content="([^"]*)"')
    lang = meta(body, r'<html[^>]*\blang="([^"]*)"')
    h1s = [re.sub(r"<[^>]+>", " ", h).strip() for h in re.findall(r"<h1[^>]*>(.*?)</h1>", body, re.S)]
    h1s = [re.sub(r"\s+", " ", h) for h in h1s]
    h2 = len(re.findall(r"<h2[^>]*>", body))
    ld_raw = re.findall(r'<script type="application/ld\+json">(.*?)</script>', body, re.S)
    ld_types = []
    ld_bad = 0
    for block in ld_raw:
        try:
            data = json.loads(block)
            for node in data if isinstance(data, list) else [data]:
                t = node.get("@type")
                ld_types.append(t if isinstance(t, str) else str(t))
        except Exception:
            ld_bad += 1

    # Images with no alt attribute at all (decorative ones use alt="" deliberately).
    imgs = re.findall(r"<img\b[^>]*>", body)
    no_alt = [t for t in imgs if "alt=" not in t]
    empty_alt = [t for t in imgs if re.search(r'alt=""', t)]

    rows.append(
        {
            "path": path,
            "status": status,
            "title": title,
            "title_len": len(title or ""),
            "desc": desc,
            "desc_len": len(desc or ""),
            "canonical": canonical,
            "robots": robots,
            "og_title": og_title,
            "og_desc": og_desc,
            "og_url": og_url,
            "og_img": og_img,
            "tw_card": tw_card,
            "lang": lang,
            "h1": h1s,
            "h2_count": h2,
            "ld_types": ld_types,
            "ld_bad": ld_bad,
            "img_total": len(imgs),
            "img_no_alt": len(no_alt),
            "img_empty_alt": len(empty_alt),
        }
    )

json.dump(rows, open("/tmp/seo-report.json", "w"), indent=1)
print(f"crawled {len(rows)} pages\n")

print("=== STATUS ===")
print(" ", Counter(r["status"] for r in rows))

print("\n=== TITLES ===")
print("  missing:", sum(1 for r in rows if not r["title"]))
print("  over 60 chars:", sum(1 for r in rows if r["title_len"] > 60))
print("  under 15 chars:", sum(1 for r in rows if r["title_len"] < 15))
dup_t = [t for t, c in Counter(r["title"] for r in rows).items() if c > 1 and t]
print("  duplicate titles:", len(dup_t))
for t in dup_t:
    print("    ", t, "->", [r["path"] for r in rows if r["title"] == t])
lens = sorted(r["title_len"] for r in rows)
print(f"  length: min {lens[0]} median {lens[len(lens)//2]} max {lens[-1]}")

print("\n=== META DESCRIPTIONS ===")
print("  missing:", sum(1 for r in rows if not r["desc"]))
print("  over 160 chars:", sum(1 for r in rows if r["desc_len"] > 160))
print("  under 70 chars:", sum(1 for r in rows if 0 < r["desc_len"] < 70))
dup_d = [d for d, c in Counter(r["desc"] for r in rows).items() if c > 1 and d]
print("  duplicate descriptions:", len(dup_d))
for d in dup_d:
    print("    ", (d or "")[:80], "->", [r["path"] for r in rows if r["desc"] == d])
dl = sorted(r["desc_len"] for r in rows)
print(f"  length: min {dl[0]} median {dl[len(dl)//2]} max {dl[-1]}")

print("\n=== CANONICALS ===")
print("  missing:", sum(1 for r in rows if not r["canonical"]))
hosts = Counter(re.sub(r"^(https?://[^/]+).*$", r"\1", c) for c in (r["canonical"] for r in rows) if c)
print("  hosts:", dict(hosts))
mismatch = [r["path"] for r in rows if r["canonical"] and not r["canonical"].endswith(r["path"] if r["path"] != "/" else "/")]
print("  canonical != own path:", len(mismatch))
for m in mismatch[:12]:
    r = next(x for x in rows if x["path"] == m)
    print(f"    {m} -> {r['canonical']}")

print("\n=== H1 ===")
print("  pages with 0 h1:", sum(1 for r in rows if len(r["h1"]) == 0))
print("  pages with >1 h1:", sum(1 for r in rows if len(r["h1"]) > 1))
for r in rows:
    if len(r["h1"]) > 1:
        print("    ", r["path"], "->", r["h1"][:3])
print("  pages with 0 h2:", sum(1 for r in rows if r["h2_count"] == 0))

print("\n=== OPEN GRAPH / TWITTER ===")
print("  missing og:title:", sum(1 for r in rows if not r["og_title"]))
print("  missing og:desc:", sum(1 for r in rows if not r["og_desc"]))
print("  missing og:image:", sum(1 for r in rows if not r["og_img"]))
print("  missing twitter:card:", sum(1 for r in rows if not r["tw_card"]))
og_url_mismatch = [r["path"] for r in rows if r["og_url"] and not r["og_url"].endswith(r["path"])]
print("  og:url != path:", len(og_url_mismatch))

print("\n=== STRUCTURED DATA ===")
print("  pages with none:", sum(1 for r in rows if not r["ld_types"]))
print("  malformed blocks:", sum(r["ld_bad"] for r in rows))
print("  types:", dict(Counter(t for r in rows for t in r["ld_types"])))

print("\n=== IMAGES ===")
print("  <img> without alt attribute:", sum(r["img_no_alt"] for r in rows))
print("  <img> with empty alt:", sum(r["img_empty_alt"] for r in rows))

print("\n=== LANGUAGE ===")
print(" ", Counter(r["lang"] for r in rows))

print("\n=== ROBOTS META (public pages must not be noindex) ===")
for r in rows:
    if r["robots"]:
        print("    ", r["path"], "->", r["robots"])
