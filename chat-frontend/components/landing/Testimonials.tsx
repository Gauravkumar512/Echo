"use client"

import { motion } from "framer-motion"

type Testimonial = {
  id: string
  quote: string
  sender: string
  company: string
}

const ITEMS: Testimonial[] = [
  {
    id: "TRANSMISSION_01",
    quote:
      "Switched from Slack on a Friday. By Monday, nobody missed it. Echo just gets out of the way and lets us work.",
    sender: "MAYA OKONKWO",
    company: "HEAD OF ENGINEERING · NIMBUS",
  },
  {
    id: "TRANSMISSION_02",
    quote:
      "Every other tool wanted to be a platform. Echo just wants to deliver your message. Refreshing.",
    sender: "JONAS RIEL",
    company: "STAFF SRE · VOLTA LABS",
  },
  {
    id: "TRANSMISSION_03",
    quote:
      "Our standups got 40% shorter. Not because we changed the format — because the comms were already cleaner.",
    sender: "PRIYA RAO",
    company: "VP PRODUCT · FIELDLINE",
  },
  {
    id: "TRANSMISSION_04",
    quote:
      "We tried five tools in two years. Echo is the first one nobody complained about after week one.",
    sender: "DANIEL VOSS",
    company: "CTO · ARCHFORM",
  },
  {
    id: "TRANSMISSION_05",
    quote:
      "The signal-to-noise ratio is unlike anything else. My team actually reads messages now.",
    sender: "SARA CHEN",
    company: "ENGINEERING LEAD · LIGHTPATH",
  },
  {
    id: "TRANSMISSION_06",
    quote:
      "Real-time delivery without the chaos. Echo is what I wish we had built ourselves.",
    sender: "MARCUS DELEON",
    company: "FOUNDER · DRIFTWAVE",
  },
]

function Card({ item }: { item: Testimonial }) {
  return (
    <div
      style={{
        width: 340,
        flexShrink: 0,
        padding: "28px 28px 24px",
        border: "1px solid var(--echo-border)",
        background: "#0d0d0f",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      <div
        className="font-tech"
        style={{
          fontSize: 10,
          letterSpacing: "0.24em",
          color: "var(--echo-text-mute)",
          marginBottom: 12,
        }}
      >
        {item.id}
      </div>
      <div
        style={{
          height: 1,
          background: "var(--echo-border)",
          marginBottom: 20,
        }}
      />
      <p
        style={{
          flex: 1,
          fontSize: 15,
          fontStyle: "italic",
          color: "var(--echo-text-soft)",
          lineHeight: 1.65,
          margin: "0 0 24px",
        }}
      >
        &ldquo;{item.quote}&rdquo;
      </p>
      <div
        className="font-tech"
        style={{
          fontSize: 11,
          letterSpacing: "0.14em",
          lineHeight: 1.7,
        }}
      >
        <div style={{ color: "var(--echo-text)", fontWeight: 600 }}>{item.sender}</div>
        <div style={{ color: "var(--echo-text-mute)" }}>{item.company}</div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const doubled = [...ITEMS, ...ITEMS]

  return (
    <section
      style={{
        borderBottom: "1px solid var(--echo-border)",
        padding: "120px 0",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "0 32px", maxWidth: 1200, margin: "0 auto 64px" }}>
        <motion.h2
          className="font-display"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          style={{
            fontSize: "clamp(48px, 7vw, 96px)",
            fontWeight: 700,
            textAlign: "right",
            color: "var(--echo-text)",
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Incoming.
        </motion.h2>
      </div>

      <div style={{ position: "relative" }}>
        {/* left fade */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 120,
            background: "linear-gradient(to right, #0A0A0A, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        {/* right fade */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 120,
            background: "linear-gradient(to left, #0A0A0A, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        <div className="echo-marquee-track">
          {doubled.map((item, i) => (
            <Card key={i} item={item} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes echo-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .echo-marquee-track {
          display: flex;
          gap: 20px;
          width: max-content;
          padding: 0 32px;
          animation: echo-marquee 42s linear infinite;
        }
        .echo-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
