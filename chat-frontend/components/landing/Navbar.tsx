"use client"

import Link from "next/link"

export default function Navbar() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        height: 56,
        background: "#060608",
        borderBottom: "1px solid var(--echo-border)",
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          textDecoration: "none",
        }}
      >
        <span className="echo-signal-bars" aria-hidden>
          <span />
          <span />
          <span />
        </span>
        <span
          className="font-tech"
          style={{
            fontSize: 14,
            color: "var(--echo-text)",
            letterSpacing: "0.3em",
          }}
        >
          ECHO
        </span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Link
          href="/login"
          className="font-tech"
          style={{
            padding: "6px 12px",
            fontSize: 12,
            letterSpacing: "0.18em",
            color: "var(--echo-text-mute)",
            textDecoration: "none",
            transition: "color 150ms",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--echo-text)")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--echo-text-mute)")
          }
        >
          LOG IN
        </Link>
        <Link
          href="/register"
          className="font-mono"
          style={{
            padding: "8px 14px",
            fontSize: 12,
            letterSpacing: "0.18em",
            color: "var(--echo-text)",
            textDecoration: "none",
            border: "1px solid #1f2937",
            background: "#101013",
            transition: "background 150ms, border-color 150ms, color 150ms",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#16161b"
            e.currentTarget.style.borderColor = "#2a2f3a"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#101013"
            e.currentTarget.style.borderColor = "#1f2937"
          }}
        >
          JOIN FREE
        </Link>
      </div>
    </nav>
  )
}

