"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import { getAuthToken } from "@/lib/authStorage"
import ScrollProgress from "@/components/landing/ScrollProgress"
import Navbar from "@/components/landing/Navbar"
import Hero from "@/components/landing/Hero"
import ChannelsStrip from "@/components/landing/ChannelsStrip"
import Features from "@/components/landing/Features"
import Testimonials from "@/components/landing/Testimonials"
import Stats from "@/components/landing/Stats"
import CTA from "@/components/landing/CTA"
import Footer from "@/components/landing/Footer"

export default function LandingPage() {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const check = async () => {
      if (!getAuthToken()) {
        setCheckingAuth(false)
        return
      }
      try {
        await apiClient.get("/auth/me")
        router.replace("/chat")
      } catch {
        setCheckingAuth(false)
      }
    }
    check()
  }, [router])

  if (checkingAuth) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--echo-bg)",
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.08)",
            borderTopColor: "var(--echo-text-mute)",
            animation: "spin 0.7s linear infinite",
          }}
        />
      </div>
    )
  }

  return (
    <div
      className="echo-page-on"
      style={{
        background: "var(--echo-bg)",
        color: "var(--echo-text)",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <ScrollProgress />
      <Navbar />
      <Hero />
      <ChannelsStrip />
      <Features />
      <Testimonials />
      <Stats />
      <CTA />
      <Footer />

      <div className="echo-scanlines" aria-hidden />
    </div>
  )
}
