"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import Waveform from "./Waveform"

export default function CTA() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "80vh",
        display: "grid",
        placeItems: "center",
        padding: "120px 32px",
        borderBottom: "1px solid var(--echo-border)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          pointerEvents: "none",
        }}
      >
        <Waveform amplitude={1} />
      </div>

      <div
        style={{
          position: "relative",
          textAlign: "center",
          maxWidth: 1100,
          zIndex: 1,
        }}
      >
        <motion.h2
          className="font-display"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: "clamp(60px, 9vw, 110px)",
            fontWeight: 700,
            color: "var(--echo-text)",
            letterSpacing: "-0.035em",
            lineHeight: 1,
            margin: "0 0 28px",
          }}
        >
          Ready to transmit?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontSize: 16,
            color: "var(--echo-text-mute)",
            margin: "0 0 40px",
          }}
        >
          Your team's signal is waiting. Start free.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Link
            href="/register"
            className="font-mono"
            style={{
              display: "inline-block",
              padding: "16px 32px",
              fontSize: 14,
              letterSpacing: "0.22em",
              color: "#000",
              background: "#EAEAEA",
              border: "1px solid #EAEAEA",
              textDecoration: "none",
              borderRadius: 0,
              transition: "background 180ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fff"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#EAEAEA"
            }}
          >
            OPEN CHANNEL →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
