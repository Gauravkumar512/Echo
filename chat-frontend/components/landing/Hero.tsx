"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"
import Waveform from "./Waveform"

const LINES = ["YOUR TEAM.", "ONE SIGNAL.", "ZERO NOISE."]

export default function Hero() {
  const [freq, setFreq] = useState("2.4")
  const [latency, setLatency] = useState("<1")
  const [statusTick, setStatusTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      const f = (2.4 + Math.random() * 0.09).toFixed(2)
      setFreq(f)
      const l = Math.random() < 0.5 ? "<1" : (1 + Math.floor(Math.random() * 2)).toString()
      setLatency(l)
      setStatusTick((t) => t + 1)
    }, 2200 + Math.random() * 800)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      style={{
        position: "relative",
        minHeight: "calc(100vh - 56px)",
        display: "grid",
        gridTemplateColumns: "minmax(0, 40%) minmax(0, 60%)",
        borderBottom: "1px solid var(--echo-border)",
      }}
      className="echo-hero"
    >
      <div
        style={{
          padding: "64px 48px 64px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 28,
          borderRight: "1px solid var(--echo-border)",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="font-tech"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontSize: 11,
            letterSpacing: "0.22em",
            color: "var(--echo-text-mute)",
          }}
        >
          <span className="echo-blink-dot" aria-hidden />
          SIGNAL STATUS: LIVE
        </motion.div>

        <h1
          className="font-display"
          style={{
            fontSize: "clamp(36px, 5.5vw, 72px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            fontWeight: 700,
            color: "var(--echo-text)",
            margin: 0,
          }}
        >
          {LINES.map((line, i) => (
            <span
              key={line}
              style={{
                display: "block",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              <motion.span
                initial={{ y: "100%", clipPath: "inset(0 0 100% 0)" }}
                animate={{ y: "0%", clipPath: "inset(0 0 0% 0)" }}
                transition={{
                  duration: 0.7,
                  delay: 0.2 + i * 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ display: "block" }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.95 }}
          style={{
            fontSize: 16,
            lineHeight: 1.65,
            color: "var(--echo-text-mute)",
            maxWidth: 460,
            margin: 0,
          }}
        >
          Echo transmits your teams conversations in real time. No lag. No
          bloat. Just signal.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.05 }}
        >
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <Link href="/register" className="font-mono echo-cta-primary">
              INITIATE SIGNAL
            </Link>
            <Link
              href="#features"
              className="font-mono"
              style={{
                padding: "13px 22px",
                fontSize: 12,
                letterSpacing: "0.2em",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "var(--echo-text)",
                textDecoration: "none",
                borderRadius: 0,
                transition: "border-color 150ms, background 150ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"
                e.currentTarget.style.background = "rgba(255,255,255,0.02)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"
                e.currentTarget.style.background = "transparent"
              }}
            >
              VIEW DEMO
            </Link>
          </div>
          <div
            className="font-mono"
            style={{
              marginTop: 14,
              fontSize: 11,
              color: "var(--echo-text-mute)",
              letterSpacing: "0.12em",
            }}
          >
            (Start free, no card required)
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        style={{
          position: "relative",
          overflow: "hidden",
          background: "#060608",
        }}
      >
        <Waveform grid introEase />

        {/* Readout panel */}
        <div
          className="font-tech"
          style={{
            position: "absolute",
            top: 24,
            right: 28,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontSize: 11,
            color: "var(--echo-text-mute)",
            letterSpacing: "0.14em",
            textAlign: "right",
            background: "rgba(6,6,8,0.6)",
            border: "1px solid var(--echo-border)",
            padding: "10px 12px",
            minWidth: 180,
          }}
        >
          <div>FREQ: {freq}GHz</div>
          <div>LATENCY: {latency}ms</div>
          <div>
            STATUS: TRANSMITTING
            <span style={{ opacity: statusTick % 2 ? 1 : 0.4 }}> ▌</span>
          </div>
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 900px) {
          .echo-hero { grid-template-columns: 1fr !important; }
          .echo-hero > div:first-child { border-right: none !important; border-bottom: 1px solid var(--echo-border); }
          .echo-hero > div:last-child { min-height: 360px; }
        }
      `}</style>
    </section>
  )
}
