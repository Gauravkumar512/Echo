"use client"

import { useEffect, useRef } from "react"

type Props = {
  /** 0..1 - multiplies stroke alpha (used to draw faint background copies) */
  opacity?: number
  /** Show faint horizontal grid behind the wave */
  grid?: boolean
  /** Stroke color (defaults to white) */
  color?: string
  /** Initial amplitude factor 0..1; the wave still breathes around this */
  amplitude?: number
  /** When true, the wave starts at 0 amplitude and eases up to `amplitude` */
  introEase?: boolean
  className?: string
  style?: React.CSSProperties
}

export default function Waveform({
  opacity = 0.9,
  grid = false,
  color = "255, 255, 255",
  amplitude = 1,
  introEase = false,
  className,
  style,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf = 0
    let phase = 0
    const start = performance.now()

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1)
      const { clientWidth, clientHeight } = canvas
      canvas.width = clientWidth * dpr
      canvas.height = clientHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const onResize = () => resize()
    window.addEventListener("resize", onResize)

    const draw = (now: number) => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)

      // Grid
      if (grid) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.03)"
        ctx.lineWidth = 1
        for (let y = 40; y < h; y += 40) {
          ctx.beginPath()
          ctx.moveTo(0, y + 0.5)
          ctx.lineTo(w, y + 0.5)
          ctx.stroke()
        }
      }

      const elapsed = (now - start) / 1000
      const breathe = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin((elapsed / 4) * Math.PI * 2))
      let amp = amplitude * breathe
      if (introEase) {
        const intro = Math.min(1, elapsed / 1.2)
        amp *= intro * intro * (3 - 2 * intro) // smoothstep
      }
      const ampPx = (h / 2) * 0.55 * amp

      // Wave
      ctx.strokeStyle = `rgba(${color}, ${opacity})`
      ctx.lineWidth = 1.5
      ctx.lineJoin = "round"
      ctx.beginPath()
      const step = 2
      for (let x = 0; x <= w; x += step) {
        const t = x / w
        const y =
          h / 2 +
          Math.sin(t * Math.PI * 4 + phase) * ampPx * 0.6 +
          Math.sin(t * Math.PI * 9 + phase * 1.6) * ampPx * 0.3 +
          Math.sin(t * Math.PI * 17 - phase * 0.7) * ampPx * 0.12
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      phase += 0.045 // scroll the wave to the left
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
    }
  }, [opacity, grid, color, amplitude, introEase])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        ...style,
      }}
    />
  )
}
