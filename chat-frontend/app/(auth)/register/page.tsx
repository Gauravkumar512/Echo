"use client"

import { useState } from "react"
import { connectSocket } from "@/lib/socket"
import { apiClient } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import Image from "next/image"
import axios from "axios"
import { persistAuthToken } from "@/lib/authStorage"

export default function RegisterPage() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const router = useRouter()
    const { setUser } = useAuthStore()
    const startOAuth = (provider: "google" | "github") => {
        const baseUrl = (apiClient.defaults.baseURL || process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")
        if (!baseUrl) {
            setError("OAuth is not configured")
            return
        }
        window.location.href = `${baseUrl}/auth/${provider}`
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        const normalizedUsername = username.trim().replace(/\s+/g, "_")

        if (normalizedUsername.length < 3 || normalizedUsername.length > 20 || !usernameRegex.test(normalizedUsername)) {
            setError("Username must be 3–20 characters: letters, numbers, underscores only")
            setLoading(false)
            return
        }

        try {
            const response = await apiClient.post('/auth/register', {
                username: normalizedUsername,
                email: email.trim(),
                password,
            })
            const { user: userData, accessToken } = response.data.data
            if (accessToken) {
                persistAuthToken(accessToken)
            }
            setUser(userData)
            connectSocket()
            router.push('/chat')
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const backendError = error.response?.data?.error?.[0]
                const message = error.response?.data?.message
                if (typeof backendError === "string") {
                    setError(backendError)
                } else if (typeof message === "string") {
                    setError(message)
                } else {
                    setError("An error occurred during registration")
                }
            } else {
                setError("An error occurred during registration")
            }
        } finally {
            setLoading(false)
        }
    }

    const inputStyle: React.CSSProperties = {
        width: '100%', height: '38px', boxSizing: 'border-box',
        background: '#111', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '4px', padding: '0 12px',
        fontSize: '13px', color: '#e4e4e7', outline: 'none',
        fontFamily: 'inherit', transition: 'border-color 0.15s',
    }

    const labelStyle: React.CSSProperties = {
        display: 'block', fontSize: '11px', fontWeight: 500,
        color: '#a1a1aa', marginBottom: '6px', letterSpacing: '0.02em',
    }

    return (
        <div style={{
            minHeight: '100vh', width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#0a0a0f',
            fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif',
        }}>
            <div style={{
                width: '100%', maxWidth: '380px',
                margin: '0 auto', padding: '40px 24px',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 18, height: 18, color: '#e4e4e7' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                    </svg>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>Echo</span>
                </div>

                {/* Heading */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                        Create an account
                    </h1>
                    <p style={{ fontSize: '12px', color: '#52525b', margin: 0 }}>
                        Get started with Echo for free
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        width: '100%', marginBottom: '16px',
                        padding: '10px 12px', borderRadius: '4px',
                        background: '#1a0a0a', border: '1px solid #3f1515',
                        fontSize: '12px', color: '#ef4444', fontWeight: 500,
                    }}>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                    <div>
                        <label htmlFor="register-username" style={labelStyle}>Username</label>
                        <input
                            id="register-username"
                            type="text"
                            placeholder="your_username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value.replace(/\s+/g, "_"))}
                            required
                            style={inputStyle}
                            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                        />
                        <p style={{ marginTop: '4px', fontSize: '11px', color: '#52525b' }}>
                            3–20 characters: letters, numbers, underscores
                        </p>
                    </div>

                    <div>
                        <label htmlFor="register-email" style={labelStyle}>Email</label>
                        <input
                            id="register-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={inputStyle}
                            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                        />
                    </div>

                    <div>
                        <label htmlFor="register-password" style={labelStyle}>Password</label>
                        <input
                            id="register-password"
                            type="password"
                            placeholder="········"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                        />
                    </div>

                    <p style={{ fontSize: '11px', color: '#52525b', lineHeight: 1.6 }}>
                        By creating an account you agree to our{' '}
                        <span style={{ color: '#a1a1aa', cursor: 'pointer' }}>Terms</span> and{' '}
                        <span style={{ color: '#a1a1aa', cursor: 'pointer' }}>Privacy Policy</span>.
                    </p>

                    <button
                        type="submit"
                        id="register-submit"
                        disabled={loading}
                        style={{
                            width: '100%', height: '38px', marginTop: '4px',
                            borderRadius: '4px', border: 'none',
                            background: loading ? '#1a1a1f' : '#fff',
                            color: loading ? '#52525b' : '#111',
                            fontSize: '13px', fontWeight: 500,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background 0.15s, color 0.15s',
                            fontFamily: 'inherit',
                        }}
                    >
                        {loading ? "Creating account…" : "Create account"}
                    </button>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0' }}>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                        <span style={{ fontSize: '11px', color: '#52525b' }}>or continue with</span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        {[
                            { src: '/google-color-svgrepo-com.svg', label: 'Google' },
                            { src: '/github-svgrepo-com.svg', label: 'GitHub' },
                        ].map(({ src, label }) => (
                            <button
                                key={label}
                                type="button"
                                onClick={() => startOAuth(label.toLowerCase() as "google" | "github")}
                                style={{
                                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    gap: '8px', height: '36px',
                                    background: '#111', border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '4px', fontSize: '12px',
                                    color: '#a1a1aa', cursor: 'pointer',
                                    fontFamily: 'inherit', transition: 'border-color 0.15s, color 0.15s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                                    e.currentTarget.style.color = '#e4e4e7';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                    e.currentTarget.style.color = '#a1a1aa';
                                }}
                            >
                                <Image
                                    src={src}
                                    alt={`${label} icon`}
                                    width={14}
                                    height={14}
                                    style={{ filter: label === "GitHub" ? "invert(1)" : "none" }}
                                />
                                {label}
                            </button>
                        ))}
                    </div>
                </form>

                <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: '#52525b' }}>
                    Already have an account?{' '}
                    <Link href="/login" style={{ color: '#a1a1aa', fontWeight: 500, textDecoration: 'none' }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}