"use client";

import { useEffect, useRef } from "react";

/**
 * The hero film.
 *
 * It lives in a client component for one reason: a visitor on a metered or slow
 * connection should not pay for a background video they did not ask for. The
 * poster underneath the film is a finished composition, so when the browser
 * reports a data-saver preference or a 2G-class connection the film is stopped
 * before it downloads anything further. `prefers-reduced-data` covers the same
 * case in CSS for the browsers that expose it.
 *
 * The markup is server-rendered as usual — `autoPlay` is in the HTML, so a
 * first paint without JavaScript still plays the film.
 */
type SaveDataNavigator = Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string };
};

export function HeroFilm({
  src,
  type,
  poster,
  className,
}: {
  src: string;
  type: string;
  poster: string;
  className?: string;
}) {
  const film = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = film.current;
    if (!video) return;

    const connection = (navigator as SaveDataNavigator).connection;
    const frugal =
      connection?.saveData === true ||
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g";

    if (frugal) {
      video.pause();
      video.removeAttribute("autoplay");
      video.preload = "none";
    }
  }, []);

  return (
    <video
      ref={film}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-hidden="true"
      tabIndex={-1}
      className={className}
    >
      <source src={src} type={type} />
    </video>
  );
}
