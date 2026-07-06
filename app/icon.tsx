import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderRadius: 8,
          background: "#0056d2",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "monospace",
            fontSize: 16,
            fontWeight: 700,
            color: "white",
          }}
        >
          {"</>"}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: -1,
            right: -1,
            width: 9,
            height: 9,
            borderRadius: "50%",
            border: "2px solid white",
            background: "#f59e0b",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
