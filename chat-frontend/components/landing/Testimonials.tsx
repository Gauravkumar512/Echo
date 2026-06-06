"use client"

import { motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"

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
    company: "HEAD OF ENGINEERING - NIMBUS",
  },
  {
    id: "TRANSMISSION_02",
    quote:
      "Every other tool wanted to be a platform. Echo just wants to deliver your message. Refreshing.",
    sender: "JONAS RIEL",
    company: "STAFF SRE - VOLTA LABS",
  },
  {
    id: "TRANSMISSION_03",
    quote:
      "Our standups got 40% shorter. Not because we changed the format - because the comms were already cleaner.",
    sender: "PRIYA RAO",
    company: "VP PRODUCT - FIELDLINE",
  },
]

function Typed({ text, run }: { text: string; run: boolean }) {
  const [out, setOut] = useState("")

  useEffect(() => {
    if (!run) return
    setOut("")
    let i = 0
    const id = setInterval(() => {
      i += 1
      setOut(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, 25)
    return () => clearInterval(id)
  }, [text, run])

  return <>{out}</>
}

function Block({ item, align }: { item: Testimonial; align: "start" | "center" | "end" }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        alignSelf: align === "start" ? "start" : align === "end" ? "end" : "center",
        maxWidth: 380,
        padding: "24px 0",
      }}
    >
      <div
        className="font-tech"
        style={{
          fontSize: 11,
          color: "var(--echo-text-mute)",
          letterSpacing: "0.22em",
          marginBottom: 10,
        }}
      >
        {item.id}
      </div>
      <div
        style={{
          height: 1,
          background: "var(--echo-border)",
          marginBottom: 18,
        }}
      />
      <p
        style={{
          fontSize: 17,
          fontStyle: "italic",
          color: "var(--echo-text-soft)",
          lineHeight: 1.6,
          margin: "0 0 22px",
          minHeight: 110,
        }}
      >
        “<Typed text={item.quote} run={inView} />”
      </p>
      <div
        className="font-tech"
        style={{
          fontSize: 12,
          color: "var(--echo-text-mute)",
          letterSpacing: "0.16em",
          lineHeight: 1.6,
        }}
      >
        <div style={{ color: "var(--echo-text)" }}>{item.sender}</div>
        <div>{item.company}</div>
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  return (
    <section
      style={{
        borderBottom: "1px solid var(--echo-border)",
        padding: "120px 32px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
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
            margin: "0 0 64px",
          }}
        >
          Incoming.
        </motion.h2>

        <div
          className="echo-testimonials-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 48,
            alignItems: "stretch",
            minHeight: 420,
          }}
        >
          <Block item={ITEMS[0]} align="start" />
          <Block item={ITEMS[1]} align="center" />
          <Block item={ITEMS[2]} align="end" />
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .echo-testimonials-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            min-height: auto !important;
          }
        }
      `}</style>
    </section>
  )
}
