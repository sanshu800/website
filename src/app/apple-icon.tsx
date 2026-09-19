import { ImageResponse } from "next/og";

/** Home-screen icon for iOS/iPadOS. Without one, "Add to Home Screen" shows a blank tile. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#f7f7f7",
          fontSize: "104px",
          fontWeight: 700,
          fontFamily: "sans-serif",
          letterSpacing: "-0.04em",
        }}
      >
        R
      </div>
    ),
    size,
  );
}
