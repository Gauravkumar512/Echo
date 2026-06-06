"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: 24,
        padding: "20px 32px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
      className="echo-footer"
    >
      <div
        className="font-tech"
        style={{
          fontSize: 11,
          color: "#333344",
          letterSpacing: "0.22em",
        }}
      >
        ECHO · SIGNAL NEVER DROPS
      </div>

      <div
        className="font-tech"
        style={{
          display: "flex",
          gap: 16,
          fontSize: 11,
          letterSpacing: "0.22em",
        }}
      >
        {["ABOUT", "PRIVACY", "TERMS"].map((l, i, arr) => (
          <span key={l} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link
              href="#"
              style={{
                color: "#333344",
                textDecoration: "none",
                transition: "color 150ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--echo-text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#333344")}
            >
              {l}
            </Link>
            {i < arr.length - 1 && <span style={{ color: "#222233" }}>·</span>}
          </span>
        ))}
      </div>

      <div
        className="font-tech"
        style={{
          fontSize: 11,
          color: "#333344",
          letterSpacing: "0.22em",
          textAlign: "right",
        }}
      >
        © 2026
      </div>

      <style>{`
        @media (max-width: 720px) {
          .echo-footer {
            grid-template-columns: 1fr !important;
            text-align: center;
            justify-items: center;
          }
          .echo-footer > div:last-child { text-align: center !important; }
        }
      `}</style>
    </footer>
  )
}
