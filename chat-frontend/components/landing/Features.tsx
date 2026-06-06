"use client"

import { motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"

function PacketCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf = 0
    let t = 0

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1)
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    const trail: { x: number; life: number }[] = []

    const draw = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)

      const y = h / 2
      const padX = 36
      const ax = padX
      const bx = w - padX

      // Endpoints
      ctx.fillStyle = "rgba(232,232,240,0.7)"
      ctx.beginPath()
      ctx.arc(ax, y, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(bx, y, 5, 0, Math.PI * 2)
      ctx.fill()

      // Line
      ctx.strokeStyle = "rgba(255,255,255,0.08)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(ax, y)
      ctx.lineTo(bx, y)
      ctx.stroke()

      // Packet position - fast loop
      const cycle = (t % 90) / 90
      const px = ax + (bx - ax) * cycle

      trail.push({ x: px, life: 1 })
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].life -= 0.04
        if (trail[i].life <= 0) trail.splice(i, 1)
      }

      // Trail
      for (const p of trail) {
        ctx.fillStyle = `rgba(232,232,240,${0.5 * p.life})`
        ctx.beginPath()
        ctx.arc(p.x, y, 2.4 * p.life, 0, Math.PI * 2)
        ctx.fill()
      }

      // Packet head
      ctx.fillStyle = "rgba(232,232,240,1)"
      ctx.beginPath()
      ctx.arc(px, y, 3.5, 0, Math.PI * 2)
      ctx.fill()

      t += 1
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} />
}

type Node = { x: number; y: number; parent: number | null; born: number }

function GraphCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf = 0
    let nodes: Node[] = []
    let cycleStart = performance.now()

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1)
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    const reset = (now: number) => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      nodes = [{ x: w / 2, y: h / 2, parent: null, born: now }]
      cycleStart = now
    }
    reset(performance.now())

    const TARGET_COUNT = 18
    const CYCLE_MS = 6000

    const draw = (now: number) => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)

      const elapsed = now - cycleStart

      // Add new nodes over time, evenly across the first 70% of the cycle
      const targetByNow = Math.min(
        TARGET_COUNT,
        Math.floor((elapsed / (CYCLE_MS * 0.7)) * TARGET_COUNT)
      )
      while (nodes.length < targetByNow) {
        const parentIdx = Math.floor(Math.random() * nodes.length)
        const parent = nodes[parentIdx]
        const angle = Math.random() * Math.PI * 2
        const dist = 36 + Math.random() * 48
        const x = Math.max(20, Math.min(w - 20, parent.x + Math.cos(angle) * dist))
        const y = Math.max(20, Math.min(h - 20, parent.y + Math.sin(angle) * dist))
        nodes.push({ x, y, parent: parentIdx, born: now })
      }

      // Draw edges
      ctx.strokeStyle = "rgba(232,232,240,0.18)"
      ctx.lineWidth = 1
      for (const n of nodes) {
        if (n.parent == null) continue
        const p = nodes[n.parent]
        const age = Math.min(1, (now - n.born) / 500)
        ctx.globalAlpha = age
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(
          p.x + (n.x - p.x) * age,
          p.y + (n.y - p.y) * age
        )
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      // Draw nodes
      for (const n of nodes) {
        const age = Math.min(1, (now - n.born) / 500)
        ctx.fillStyle = `rgba(232,232,240,${0.85 * age})`
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.parent == null ? 4 : 2.5, 0, Math.PI * 2)
        ctx.fill()
      }

      // Reset after cycle
      if (elapsed > CYCLE_MS) reset(now)

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} />
}

type Feature = {
  num: string
  title: string
  desc: string
  visual: React.ReactNode
}

const FEATURES: Feature[] = [
  {
    num: "01",
    title: "ZERO LAG TRANSMISSION",
    desc: "Every packet routed through Echo arrives the instant it leaves. Sub-millisecond delivery, globally.",
    visual: <PacketCanvas />,
  },
  {
    num: "02",
    title: "CHANNELS THAT SCALE",
    desc: "From a five-person squad to a thousand-node org. Echo's graph grows with you - without slowing down.",
    visual: <GraphCanvas />,
  },
]

export default function Features() {
  return (
    <section
      id="features"
      style={{
        borderBottom: "1px solid var(--echo-border)",
      }}
    >
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "120px 32px 32px" }}>
        <motion.h2
          className="font-display"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          style={{
            fontSize: "clamp(36px, 5.5vw, 64px)",
            fontWeight: 700,
            color: "var(--echo-text)",
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Frequencies.
        </motion.h2>
      </div>

      <div>
        {FEATURES.map((f, i) => (
          <Row key={f.num} feature={f} index={i} />
        ))}
      </div>
    </section>
  )
}

function Row({ feature, index }: { feature: Feature; index: number }) {
  const fromLeft = index % 2 === 0
  return (
    <div
      style={{
        position: "relative",
        minHeight: "92vh",
        display: "grid",
        gridTemplateColumns: "minmax(0, 0.45fr) minmax(0, 1fr) minmax(0, 0.95fr)",
        alignItems: "center",
        gap: 24,
        padding: "0 56px",
        borderTop:
          index === 0 ? "1px solid var(--echo-border)" : "1px solid transparent",
        borderBottom: "1px solid var(--echo-border)",
      }}
      className="echo-feature-row"
    >
      {/* Watermark number */}
      <motion.div
        className="font-tech"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.07 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9 }}
        style={{
          fontSize: 120,
          lineHeight: 1,
          color: "var(--echo-text)",
          letterSpacing: "0.02em",
          userSelect: "none",
        }}
      >
        {feature.num}
      </motion.div>

      {/* Center copy */}
      <motion.div
        initial={{ opacity: 0, x: fromLeft ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ maxWidth: 520 }}
      >
        <h3
          className="font-tech"
          style={{
            fontSize: "clamp(28px, 3.5vw, 44px)",
            color: "var(--echo-text)",
            letterSpacing: "0.04em",
            lineHeight: 1.1,
            margin: "0 0 18px",
          }}
        >
          {feature.title}
        </h3>
        <p
          style={{
            fontSize: 16,
            color: "var(--echo-text-mute)",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {feature.desc}
        </p>
      </motion.div>

      {/* Right visual */}
      <motion.div
        initial={{ opacity: 0, x: fromLeft ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative",
          height: "min(380px, 55vh)",
          border: "1px solid var(--echo-border)",
          background: "var(--echo-surface-1)",
        }}
      >
        {feature.visual}
      </motion.div>

      <style>{`
        @media (max-width: 960px) {
          .echo-feature-row {
            grid-template-columns: 1fr !important;
            padding: 80px 24px !important;
            min-height: auto !important;
          }
          .echo-feature-row > div:last-child {
            height: 280px !important;
          }
        }
      `}</style>
    </div>
  )
}
