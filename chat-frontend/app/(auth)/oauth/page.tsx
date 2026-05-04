"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import { connectSocket } from "@/lib/socket"
import { useAuthStore } from "@/store/useAuthStore"
import { clearAuthToken, persistAuthToken } from "@/lib/authStorage"

export default function OAuthPage() {
    const router = useRouter()
    const { setUser } = useAuthStore()
    const [message, setMessage] = useState("Finishing sign-in...")

    useEffect(() => {
        const accessToken = new URLSearchParams(window.location.search).get("accessToken")

        if (!accessToken) {
            setMessage("OAuth callback is missing a token")
            return
        }

        const finalizeSignIn = async () => {
            try {
                persistAuthToken(accessToken)

                const response = await apiClient.get("/auth/me")
                setUser(response.data.data)
                connectSocket()
                router.replace("/chat")
            } catch {
                clearAuthToken()
                setMessage("We could not complete sign-in. Please try again.")
                router.replace("/login?error=auth_failed")
            }
        }

        finalizeSignIn()
    }, [router, setUser])

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0a0f',
            color: '#e4e4e7',
            fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif',
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: '2px solid #333',
                    borderTopColor: '#71717a',
                    animation: 'spin 0.7s linear infinite',
                    margin: '0 auto 12px',
                }} />
                <p style={{ fontSize: 13, color: '#a1a1aa', margin: 0 }}>{message}</p>
            </div>
        </div>
    )
}