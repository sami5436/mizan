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
          background: "#ffffff",
          fontFamily: "sans-serif",
          color: "#111113",
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
                color: "#6e6e76",
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
              border: "1px solid #e4e4e7",
              borderRadius: 999,
              padding: "10px 22px",
              background: "#ffffff",
              fontSize: 22,
              color: "#111113",
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
                background: strong ? "#111113" : "#ffffff",
                color: strong ? "#ffffff" : "#111113",
                border: `1px solid ${strong ? "#111113" : "#e4e4e7"}`,
                borderRadius: 14,
                fontSize: strong ? 34 : 29,
              }}
            >
              <span style={{ color: strong ? "rgba(255,255,255,0.65)" : "#6e6e76" }}>{label}</span>
              <span style={{ fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 21,
            color: "#6e6e76",
            borderTop: "1px solid #e4e4e7",
            paddingTop: 18,
          }}
        >
          <span>Gold value · Making charge · Tax · Markup %</span>
          <span style={{ color: "#111113" }}>English and Arabic</span>
        </div>
      </div>
    ),
    size,
  );
}
