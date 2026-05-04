"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import Link from "next/link"

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1800
          const steps = 60
          const increment = target / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}


export default function LandingPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const check = async () => {
      try {
        await apiClient.get("/auth/me")
        router.replace("/chat")
      } catch {
        setCheckingAuth(false)
      }
    }
    check()
  }, [router])

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/register${email ? `?email=${encodeURIComponent(email)}` : ""}`)
  }

  if (checkingAuth) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: '#0a0a0f',
      }}>
        <div style={{
          width: 24, height: 24, borderRadius: '50%',
          border: '2px solid #333', borderTopColor: '#71717a',
          animation: 'spin 0.7s linear infinite',
        }} />
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .lp-fade-1 { animation: fadeUp 0.5s ease-out 0.1s both; }
        .lp-fade-2 { animation: fadeUp 0.5s ease-out 0.2s both; }
        .lp-fade-3 { animation: fadeUp 0.5s ease-out 0.35s both; }
        .lp-fade-4 { animation: fadeUp 0.5s ease-out 0.5s both; }

        .lp-btn-ghost:hover { color: #e4e4e7 !important; }
        .lp-btn-primary:hover { background: #e4e4e7 !important; }
        .lp-feature:hover { border-color: rgba(255,255,255,0.12) !important; }
        .lp-cta-main:hover { background: #e4e4e7 !important; }

        .lp-stat-row:not(:last-child) { border-right: 1px solid rgba(255,255,255,0.06); }

        @media (max-width: 860px) {
          .lp-hero-grid { grid-template-columns: 1fr !important; }
          .lp-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .lp-features-grid { grid-template-columns: 1fr !important; }
          .lp-stat-row { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.06); }
        }
        @media (max-width: 600px) {
          .lp-nav { padding: 0 16px !important; }
          .lp-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{
        fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif',
        background: '#0a0a0f', color: '#a1a1aa',
        overflowX: 'hidden',
      }}>

        {/* ── Navbar ── */}
        <nav className="lp-nav" style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', height: '52px',
          background: 'rgba(10,10,15,0.85)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(8px)',
        }}>
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none',
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 16, height: 16, color: '#e4e4e7' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
            </svg>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>Echo</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/login" className="lp-btn-ghost" style={{
              padding: '6px 14px', borderRadius: '4px',
              fontSize: '13px', fontWeight: 400, color: '#71717a',
              background: 'transparent', textDecoration: 'none',
              transition: 'color 0.15s',
            }}>
              Log in
            </Link>
            <Link href="/register" className="lp-btn-primary" style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '6px 16px', borderRadius: '4px',
              fontSize: '13px', fontWeight: 500, color: '#111',
              background: '#fff', textDecoration: 'none',
              transition: 'background 0.15s',
            }}>
              Sign up free
            </Link>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          padding: '100px 32px 64px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div className="lp-hero-grid" style={{
            maxWidth: '1100px', margin: '0 auto', width: '100%',
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '64px', alignItems: 'center',
          }}>
            {/* Copy */}
            <div>
              <p className="lp-fade-1" style={{
                fontSize: '10px', fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                color: '#52525b', marginBottom: '20px',
              }}>
                Real-time messaging
              </p>
              <h1 className="lp-fade-2" style={{
                fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
                fontWeight: 600, lineHeight: 1.1,
                letterSpacing: '-0.03em', color: '#fff',
                margin: '0 0 16px',
              }}>
                Where conversations<br />
                <span style={{ color: '#71717a' }}>resonate.</span>
              </h1>
              <p className="lp-fade-3" style={{
                fontSize: '15px', color: '#71717a', lineHeight: 1.7,
                margin: '0 0 32px', maxWidth: '440px',
              }}>
                Fast, secure, and focused. Echo gives your team a clean workspace to communicate without the noise.
              </p>
              <form className="lp-fade-4" onSubmit={handleGetStarted} style={{
                display: 'flex', gap: '8px', flexWrap: 'wrap',
              }}>
                <input
                  id="hero-email-input"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1, minWidth: '200px', height: '40px',
                    background: '#111', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '4px', padding: '0 14px',
                    fontSize: '13px', color: '#e4e4e7', outline: 'none',
                    fontFamily: 'inherit', transition: 'border-color 0.15s',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                />
                <button
                  type="submit"
                  id="hero-cta-btn"
                  className="lp-cta-main"
                  style={{
                    height: '40px', padding: '0 20px',
                    borderRadius: '4px', border: 'none',
                    fontSize: '13px', fontWeight: 500,
                    background: '#fff', color: '#111',
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'background 0.15s',
                  }}
                >
                  Get started free
                </button>
              </form>
              <p className="lp-fade-4" style={{
                fontSize: '11px', color: '#52525b', marginTop: '12px',
              }}>
                No credit card required · Free forever
              </p>
            </div>

            {/* App preview */}
            <div style={{
              background: '#111', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px', overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
            }}>
              {/* Window chrome */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 14px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: '#0a0a0f',
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#333' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#333' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#333' }} />
                <span style={{
                  marginLeft: '8px', fontSize: '11px', color: '#52525b',
                  fontFamily: 'var(--font-geist-mono), monospace',
                }}>
                  # general
                </span>
              </div>
              {/* Messages preview */}
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { name: 'alex', text: 'Just shipped the new auth flow 🚀', me: false },
                  { name: 'sam', text: 'Nice. Any breaking changes?', me: false },
                  { name: 'you', text: 'None. Fully backward-compatible.', me: true },
                  { name: 'alex', text: 'Perfect. Merging now.', me: false },
                ].map((msg, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: msg.me ? 'flex-end' : 'flex-start',
                  }}>
                    <div style={{ maxWidth: '75%' }}>
                      {!msg.me && <p style={{
                        fontSize: '10px', color: '#52525b', marginBottom: '4px',
                        fontWeight: 500, letterSpacing: '0.01em',
                      }}>{msg.name}</p>}
                      <div style={{
                        padding: '8px 12px', borderRadius: msg.me ? '10px 10px 3px 10px' : '10px 10px 10px 3px',
                        background: msg.me ? '#fff' : '#1a1a1f',
                        color: msg.me ? '#111' : '#a1a1aa',
                        fontSize: '12px', lineHeight: 1.5,
                        border: msg.me ? 'none' : '1px solid rgba(255,255,255,0.05)',
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Input preview */}
              <div style={{
                padding: '10px 16px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                background: '#0a0a0f',
              }}>
                <div style={{
                  background: '#111', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '4px', padding: '8px 12px',
                  fontSize: '12px', color: '#52525b',
                }}>
                  Type a message…
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section style={{ background: '#0d0d12', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="lp-stats-grid" style={{
            maxWidth: '1100px', margin: '0 auto',
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          }}>
            {[
              { value: 2, suffix: "M+", label: "Active users" },
              { value: 50, suffix: "M+", label: "Messages daily" },
              { value: 150, suffix: "+", label: "Countries" },
              { value: 99.9, suffix: "%", label: "Uptime" },
            ].map((s) => (
              <div className="lp-stat-row" key={s.label} style={{
                textAlign: 'center', padding: '28px 16px',
              }}>
                <div style={{
                  fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                  fontWeight: 600, color: '#fff',
                  letterSpacing: '-0.03em', lineHeight: 1,
                }}>
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: '11px', color: '#52525b', marginTop: '6px', fontWeight: 400 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section style={{
          padding: '80px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <p style={{
              fontSize: '10px', fontWeight: 500, textTransform: 'uppercase',
              letterSpacing: '0.1em', color: '#52525b', marginBottom: '12px',
            }}>
              Built for teams
            </p>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 600,
              color: '#fff', letterSpacing: '-0.03em', marginBottom: '48px',
              margin: '0 0 48px',
            }}>
              Everything you need.
            </h2>
            <div className="lp-features-grid" style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px', overflow: 'hidden',
            }}>
              {[
                {
                  title: "Lightning fast",
                  desc: "Real-time delivery with zero perceptible lag. Messages arrive as you type.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
                      <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
                    </svg>
                  ),
                },
                {
                  title: "Secure & private",
                  desc: "End-to-end encryption keeps your conversations private. Your data is yours.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
                      <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                    </svg>
                  ),
                },
                {
                  title: "Organised channels",
                  desc: "Structure conversations by topic. Keep focused threads without the noise.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
                      <path fillRule="evenodd" d="M3.75 6.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zm0 3.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zm0 3.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" clipRule="evenodd" />
                    </svg>
                  ),
                },
                {
                  title: "Cross-platform",
                  desc: "Access from any device. Your workspace is always in sync.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
                      <path fillRule="evenodd" d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625zm1.5 0v1.5c0 .207.168.375.375.375h1.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-1.5A.375.375 0 003 5.625zm16.125-.375a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h1.5A.375.375 0 0021 7.125v-1.5a.375.375 0 00-.375-.375h-1.5z" clipRule="evenodd" />
                    </svg>
                  ),
                },
              ].map((f) => (
                <div key={f.title} className="lp-feature" style={{
                  padding: '28px 24px', background: '#0a0a0f',
                  borderRight: '1px solid rgba(255,255,255,0.06)',
                  transition: 'border-color 0.15s',
                }}>
                  <div style={{
                    color: '#71717a', marginBottom: '14px',
                  }}>
                    {f.icon}
                  </div>
                  <h3 style={{
                    fontSize: '13px', fontWeight: 500, color: '#e4e4e7',
                    marginBottom: '8px', letterSpacing: '-0.01em',
                  }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#52525b', lineHeight: 1.65 }}>
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{
          padding: '80px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 600,
              color: '#fff', letterSpacing: '-0.03em',
              margin: '0 0 12px',
            }}>
              Start for free, today.
            </h2>
            <p style={{
              fontSize: '14px', color: '#71717a', lineHeight: 1.7,
              margin: '0 0 28px',
            }}>
              No setup, no credit card. Just sign up and start messaging.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" id="cta-signup-btn" className="lp-cta-main" style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '10px 24px', borderRadius: '4px', border: 'none',
                fontSize: '13px', fontWeight: 500, background: '#fff', color: '#111',
                textDecoration: 'none', transition: 'background 0.15s',
              }}>
                Get started free
              </Link>
              <Link href="/login" id="cta-login-btn" style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '10px 24px', borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.08)',
                fontSize: '13px', fontWeight: 400, background: 'transparent', color: '#71717a',
                textDecoration: 'none', transition: 'color 0.15s',
              }}>
                Log in
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '12px',
          padding: '20px 32px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 14, height: 14, color: '#52525b' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
            </svg>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#71717a' }}>Echo</span>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['About', 'Privacy', 'Terms', 'Support'].map((l) => (
              <a key={l} href="#" style={{
                fontSize: '11px', color: '#52525b', textDecoration: 'none',
                transition: 'color 0.15s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#a1a1aa'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#52525b'; }}
              >
                {l}
              </a>
            ))}
          </div>
          <p style={{ fontSize: '11px', color: '#52525b' }}>© 2026 Echo.</p>
        </footer>
      </div>
    </>
  )
}
