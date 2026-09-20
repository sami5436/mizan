import { ImageResponse } from "next/og";

export const alt = "Mizan, a gold jewelry price breakdown calculator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social preview card. iMessage, Slack, WhatsApp, and X all read this.
 * Rendered once at build time since it takes no parameters.
 */
export default function OpengraphImage() {
  const rows: Array<[string, string, boolean]> = [
    ["Raw gold value", "185.000 KWD", false],
    ["Making charge", "20.000 KWD", false],
    ["Tax and fees", "10.250 KWD", false],
    ["Expected fair price", "215.250 KWD", true],
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "54px 64px",
          background: "#f4efe7",
          backgroundImage:
            "radial-gradient(circle at 8% 0%, rgba(220,180,92,0.40), transparent 45%), radial-gradient(circle at 96% 10%, rgba(154,108,20,0.18), transparent 42%)",
          fontFamily: "sans-serif",
          color: "#23211f",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 74,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              Mizan
            </div>
            <div
              style={{
                marginTop: 14,
                fontSize: 27,
                color: "#7a736b",
                letterSpacing: "0.02em",
              }}
            >
              Gold jewelry price breakdown
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              border: "1px solid #e3dbcd",
              borderRadius: 999,
              padding: "10px 22px",
              background: "#fdfbf7",
              fontSize: 22,
              color: "#9a6c14",
              letterSpacing: "0.12em",
            }}
          >
            18K · 21K · 22K · 24K
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rows.map(([label, value, strong]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 26px",
                background: strong ? "#23211f" : "#fdfbf7",
                color: strong ? "#f4efe7" : "#23211f",
                border: `1px solid ${strong ? "#23211f" : "#e3dbcd"}`,
                borderRadius: 14,
                fontSize: strong ? 34 : 29,
              }}
            >
              <span style={{ color: strong ? "#dcb45c" : "#7a736b" }}>{label}</span>
              <span style={{ fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 21,
            color: "#7a736b",
            borderTop: "1px solid #e3dbcd",
            paddingTop: 18,
          }}
        >
          <span>Gold value · Making charge · Tax · Markup %</span>
          <span style={{ color: "#9a6c14" }}>English and Arabic</span>
        </div>
      </div>
    ),
    size,
  );
}
