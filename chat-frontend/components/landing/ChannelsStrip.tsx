"use client"

import { useEffect, useState } from "react"

type Channel = {
  name: string
  members: number
  unread?: number
  active?: boolean
}

type Member = {
  name: string
  handle: string
  status: "online" | "idle" | "off"
}

const CHANNELS: Channel[] = [
  { name: "general", members: 48, active: true },
  { name: "engineering", members: 26, unread: 3 },
  { name: "design-crit", members: 14, unread: 12 },
  { name: "deploys", members: 9 },
  { name: "random", members: 33, unread: 1 },
]

const MEMBERS: Member[] = [
  { name: "Maya Okonkwo", handle: "maya", status: "online" },
  { name: "Jonas Riel", handle: "jonas", status: "online" },
  { name: "Priya Rao", handle: "priya", status: "idle" },
  { name: "Sam Chen", handle: "sam", status: "off" },
]

function Dot({ status }: { status: Member["status"] }) {
  return (
    <span
      className={`echo-presence-dot ${status === "idle" ? "idle" : ""} ${
        status === "off" ? "off" : ""
      }`}
      aria-hidden
    />
  )
}

export default function ChannelsStrip() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2400)
    return () => clearInterval(id)
  }, [])
  const liveOffset = ((tick * 7) % 11) - 5

  return (
    <section
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "var(--echo-surface-1)",
        padding: "72px 32px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Section label */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 24,
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          <div
            className="font-mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.28em",
              color: "var(--echo-text-mute)",
            }}
          >
            LIVE CHANNELS
          </div>
          <div
            className="font-mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              color: "var(--echo-text-faint)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span aria-hidden />
            <span>{130 + liveOffset} ONLINE NOW</span>
          </div>
        </div>

        {/* The mock UI card */}
        <div
          className="echo-channels-card"
          style={{
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            border: "1px solid var(--echo-border)",
            background: "var(--echo-bg)",
            overflow: "hidden",
            boxShadow: "0 30px 60px -30px rgba(0,0,0,0.7)",
          }}
        >
          {/* SIDEBAR */}
          <aside
            style={{
              borderRight: "1px solid var(--echo-border)",
              background: "rgba(255,255,255,0.012)",
              padding: "16px 0",
            }}
          >
            {/* Workspace */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "0 16px 14px",
                borderBottom: "1px solid var(--echo-border)",
                marginBottom: 14,
              }}
            >
              <span
                className="font-mono"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 22,
                  height: 22,
                  background: "#fff",
                  color: "#000",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                E
              </span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  className="font-mono"
                  style={{
                    fontSize: 12,
                    color: "var(--echo-text)",
                    letterSpacing: "0.08em",
                  }}
                >
                  echo_workspace
                </span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    color: "var(--echo-text-mute)",
                    letterSpacing: "0.16em",
                  }}
                >
                </span>
              </div>
            </div>

            {/* Section: CHANNELS */}
            <SidebarSection label="CHANNELS">
              {CHANNELS.map((c) => (
                <ChannelRow key={c.name} channel={c} />
              ))}
            </SidebarSection>

          </aside>

          {/* PANEL (thin slice for context — shows it's a real app) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: 360,
            }}
          >
            {/* Channel header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 22px",
                borderBottom: "1px solid var(--echo-border)",
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: 14,
                  color: "var(--echo-text)",
                  letterSpacing: "0.04em",
                }}
              >
                # general
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: "var(--echo-text-mute)",
                }}
              >
                · 48 members
              </span>
              <span style={{ flex: 1 }} />
              <span
                className="font-mono"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  color: "var(--echo-text-mute)",
                }}
              >
                <span className="echo-presence-dot" aria-hidden />
                LIVE
              </span>
            </div>

            {/* Sample messages */}
            <div
              style={{
                flex: 1,
                padding: "18px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <MockMessage
                handle="maya"
                time="09:41"
                text="Pushed the patch — packet loss is back under 0.01%."
              />
              <MockMessage
                handle="jonas"
                time="09:42"
                text="Confirmed. Latency graph just flattened."
              />
              <MockMessage
                handle="priya"
                time="09:43"
                text="Beautiful. Shipping the changelog."
              />
              <div
                className="font-mono"
                style={{
                  marginTop: 4,
                  fontSize: 11,
                  color: "var(--echo-text-mute)",
                  letterSpacing: "0.16em",
                }}
              >
                <span className="echo-blink-dot" aria-hidden style={{ marginRight: 8 }} />
                maya is typing…
              </div>
            </div>

            {/* Composer */}
            <div
              style={{
                borderTop: "1px solid var(--echo-border)",
                padding: "12px 22px",
              }}
            >
              <div
                className="font-mono"
                style={{
                  padding: "10px 14px",
                  border: "1px solid var(--echo-border)",
                  fontSize: 12,
                  color: "var(--echo-text-mute)",
                  letterSpacing: "0.06em",
                  background: "var(--echo-surface-1)",
                }}
              >
                {">"} message #general
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .echo-sidebar-row:hover {
          background: rgba(255,255,255,0.03);
          color: var(--echo-text) !important;
        }
        @media (max-width: 820px) {
          .echo-channels-card {
            grid-template-columns: 1fr !important;
          }
          .echo-channels-card > aside { border-right: none !important; border-bottom: 1px solid var(--echo-border); }
        }
      `}</style>
    </section>
  )
}

function SidebarSection({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        className="font-mono"
        style={{
          padding: "8px 16px 6px",
          fontSize: 10,
          letterSpacing: "0.24em",
          color: "var(--echo-text-faint)",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  )
}

function ChannelRow({ channel }: { channel: Channel }) {
  return (
    <button
      type="button"
      className="echo-sidebar-row"
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "7px 16px",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        fontSize: 13,
        background: channel.active ? "rgba(255,255,255,0.05)" : "transparent",
        color: channel.active ? "var(--echo-text)" : "var(--echo-text-soft)",
        borderLeft: channel.active
          ? "2px solid rgba(255,255,255,0.4)"
          : "2px solid transparent",
        transition: "background 150ms, color 150ms",
      }}
    >
      <span
        className="font-mono"
        style={{
          color: channel.active ? "var(--echo-text)" : "var(--echo-text-mute)",
          width: 12,
          display: "inline-block",
        }}
      >
        #
      </span>
      <span style={{ flex: 1 }}>{channel.name}</span>
      {channel.unread ? (
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            minWidth: 18,
            height: 16,
            padding: "0 5px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff",
            color: "#000",
            letterSpacing: "0.04em",
          }}
        >
          {channel.unread}
        </span>
      ) : (
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            color: "var(--echo-text-faint)",
            letterSpacing: "0.12em",
          }}
        >
          {channel.members}
        </span>
      )}
    </button>
  )
}

function MockMessage({
  handle,
  time,
  text,
}: {
  handle: string
  time: string
  text: string
}) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div
        style={{
          width: 28,
          height: 28,
          background: "var(--echo-surface-2)",
          border: "1px solid var(--echo-border)",
          display: "grid",
          placeItems: "center",
          fontSize: 11,
          color: "var(--echo-text)",
          flexShrink: 0,
        }}
        className="font-mono"
      >
        {handle[0].toUpperCase()}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            marginBottom: 2,
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: 12,
              color: "var(--echo-text)",
              letterSpacing: "0.04em",
            }}
          >
            @{handle}
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              color: "var(--echo-text-faint)",
              letterSpacing: "0.14em",
            }}
          >
            {time}
          </span>
        </div>
        <div style={{ fontSize: 13, color: "var(--echo-text-soft)", lineHeight: 1.55 }}>
          {text}
        </div>
      </div>
    </div>
  )
}
