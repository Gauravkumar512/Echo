"use client"

import { useEffect, useRef, useState } from "react"

type Metric = {
  value: number
  decimals?: number
  suffix: string
  label: string
  /** signal bar fill percentage, 0..100 */
  fill: number
}

const METRICS: Metric[] = [
  { value: 2, suffix: "M+", label: "ACTIVE TRANSMITTERS", fill: 72 },
  { value: 50, suffix: "M+", label: "DAILY PACKETS", fill: 88 },
  { value: 150, suffix: "+", label: "REGIONS ON-AIR", fill: 64 },
  { value: 99.9, decimals: 1, suffix: "%", label: "SIGNAL UPTIME", fill: 96 },
]

const ease = (t: number) => 1 - Math.pow(1 - t, 3)

function Counter({ metric, run }: { metric: Metric; run: boolean }) {
  const [v, setV] = useState(0)

  useEffect(() => {
    if (!run) return
    const duration = 1300
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setV(metric.value * ease(t))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, metric.value])

  return (
    <>
      {metric.decimals != null ? v.toFixed(metric.decimals) : Math.floor(v).toLocaleString()}
      {metric.suffix}
    </>
  )
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const [run, setRun] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRun(true)
          obs.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      style={{
        background: "var(--echo-surface-1)",
        borderBottom: "1px solid var(--echo-border)",
        padding: "96px 32px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          className="font-tech"
          style={{
            fontSize: 11,
            letterSpacing: "0.28em",
            color: "var(--echo-text-mute)",
            marginBottom: 40,
          }}
        >
          SIGNAL METRICS
        </div>

        <div
          className="echo-stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 32,
          }}
        >
          {METRICS.map((m) => (
            <div key={m.label}>
              <div
                className="font-tech"
                style={{
                  fontSize: "clamp(48px, 6vw, 80px)",
                  color: "var(--echo-text)",
                  letterSpacing: "0.02em",
                  lineHeight: 1,
                  marginBottom: 14,
                }}
              >
                <Counter metric={m} run={run} />
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#555566",
                  letterSpacing: "0.08em",
                  marginBottom: 14,
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  position: "relative",
                  height: 2,
                  background: "rgba(255,255,255,0.04)",
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                <div
                  className="echo-stat-bar-fill"
                  style={{
                    height: "100%",
                    width: run ? `${m.fill}%` : "0%",
                    background: "rgba(232,232,240,0.35)",
                    transition: "width 1400ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .echo-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 40px !important; }
        }
        @media (max-width: 520px) {
          .echo-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
