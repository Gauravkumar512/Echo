"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import { socket } from "@/lib/socket"
import { IRoom } from "@/types"
import CreateRoomModal from "@/components/chat/CreateRoomModal"

function formatRelativeTime(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60_000)
    if (mins < 1) return "just now"
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
}


function EmptyState({ hasFilter, onClear }: { hasFilter: boolean; onClear: () => void }) {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '80px 0', textAlign: 'center',
        }}>
            <p style={{ fontSize: '13px', fontWeight: 500, color: '#71717a' }}>
                {hasFilter ? "No rooms match your search" : "No rooms yet"}
            </p>
            <p style={{ fontSize: '12px', color: '#52525b', marginTop: '4px' }}>
                {hasFilter ? "Try a different keyword" : "Create one to start chatting"}
            </p>
            {hasFilter && (
                <button
                    onClick={onClear}
                    style={{
                        marginTop: '12px', fontSize: '12px', fontWeight: 500,
                        color: '#a1a1aa', background: 'none', border: 'none',
                        cursor: 'pointer', textDecoration: 'underline',
                    }}
                >
                    Clear search
                </button>
            )}
        </div>
    )
}

function SkeletonRow() {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
            <div style={{
                width: '40%', height: '12px', borderRadius: '3px',
                background: '#1a1a1f', animation: 'pulse 1.5s ease-in-out infinite',
            }} />
            <div style={{
                width: '20%', height: '12px', borderRadius: '3px',
                background: '#1a1a1f', animation: 'pulse 1.5s ease-in-out infinite',
            }} />
            <div style={{
                width: '15%', height: '12px', borderRadius: '3px',
                background: '#1a1a1f', animation: 'pulse 1.5s ease-in-out infinite', marginLeft: 'auto',
            }} />
        </div>
    )
}

export default function RoomsPage() {
    const [rooms, setRooms] = useState<IRoom[]>([])
    const [loading, setLoading] = useState(true)
    const [fetchError, setFetchError] = useState("")
    const [search, setSearch] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [hoveredRow, setHoveredRow] = useState<string | null>(null)

    const router = useRouter()

    const fetchRooms = useCallback(async () => {
        setLoading(true)
        setFetchError("")
        try {
            const res = await apiClient.get("/room")
            setRooms(res.data.data ?? res.data)
        } catch {
            setFetchError("Could not load rooms. Please try again.")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchRooms()
    }, [fetchRooms])

    useEffect(() => {
        const onRoomCreated = (payload: { room: IRoom }) => {
            const room = payload.room
            setRooms((prev) => {
                if (prev.some((existing) => existing._id === room._id)) return prev
                return [room, ...prev]
            })
        }

        const onRoomDeleted = (payload: { id: string }) => {
            setRooms((prev) => prev.filter((room) => room._id !== payload.id))
        }

        socket.on("room-created", onRoomCreated)
        socket.on("room-deleted", onRoomDeleted)

        return () => {
            socket.off("room-created", onRoomCreated)
            socket.off("room-deleted", onRoomDeleted)
        }
    }, [])

    const filteredRooms = rooms.filter(
        (r) =>
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.description?.toLowerCase().includes(search.toLowerCase())
    )

    const handleRoomCreated = (newRoom: IRoom) => {
        setRooms((prev) => [newRoom, ...prev])
        setShowModal(false)
        router.push(`/chat/room/${newRoom._id}`)
    }

    return (
        <>
            <div style={{
                display: 'flex', flexDirection: 'column',
                height: '100%', background: '#0a0a0f',
            }}>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 24px', flexShrink: 0,
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '14px', fontWeight: 600, color: '#fff',
                            letterSpacing: '-0.01em', margin: 0,
                        }}>
                            Rooms
                        </h1>
                        <p style={{ fontSize: '11px', color: '#52525b', marginTop: '2px' }}>
                            {loading
                                ? "Loading…"
                                : `${rooms.length} ${rooms.length === 1 ? "room" : "rooms"} available`}
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            id="rooms-search"
                            type="text"
                            placeholder="Search…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '180px', height: '32px',
                                background: '#111', border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '4px', padding: '0 10px',
                                fontSize: '12px', color: '#e4e4e7', outline: 'none',
                                fontFamily: 'inherit',
                                transition: 'border-color 0.15s',
                            }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                        />

                        <button
                            id="open-create-room-modal"
                            onClick={() => setShowModal(true)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                height: '32px', padding: '0 12px',
                                borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)',
                                background: '#fff', color: '#111',
                                fontSize: '12px', fontWeight: 500,
                                cursor: 'pointer', transition: 'opacity 0.15s',
                            }}
                        >
                            <span style={{ fontSize: '14px', lineHeight: 1 }}>+</span>
                            New Room
                        </button>
                    </div>
                </div>

                {fetchError && (
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        margin: '0 24px', padding: '10px 14px', marginTop: '12px',
                        borderRadius: '4px', border: '1px solid #3f1515',
                        background: '#1a0a0a',
                    }}>
                        <p style={{ fontSize: '12px', color: '#ef4444', fontWeight: 500 }}>{fetchError}</p>
                        <button
                            onClick={fetchRooms}
                            style={{
                                fontSize: '11px', fontWeight: 500, color: '#ef4444',
                                background: 'none', border: 'none', cursor: 'pointer',
                                textDecoration: 'underline', marginLeft: '12px',
                            }}
                        >
                            Retry
                        </button>
                    </div>
                )}

                <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }} className="hide-scrollbar">
                    {loading ? (
                        <div>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonRow key={i} />
                            ))}
                        </div>
                    ) : filteredRooms.length === 0 ? (
                        <EmptyState
                            hasFilter={search.length > 0}
                            onClear={() => setSearch("")}
                        />
                    ) : (
                        <div>
                            <div style={{
                                display: 'flex', alignItems: 'center',
                                padding: '10px 16px', gap: '16px',
                                borderBottom: '1px solid rgba(255,255,255,0.06)',
                            }}>
                                <span style={{
                                    flex: 2, fontSize: '10px', fontWeight: 500,
                                    textTransform: 'uppercase', letterSpacing: '0.08em',
                                    color: '#52525b',
                                }}>
                                    Name
                                </span>
                                <span style={{
                                    flex: 1, fontSize: '10px', fontWeight: 500,
                                    textTransform: 'uppercase', letterSpacing: '0.08em',
                                    color: '#52525b',
                                }}>
                                    Created by
                                </span>
                                <span style={{
                                    width: '80px', fontSize: '10px', fontWeight: 500,
                                    textTransform: 'uppercase', letterSpacing: '0.08em',
                                    color: '#52525b', textAlign: 'right',
                                }}>
                                    Time
                                </span>
                            </div>

                            {filteredRooms.map((room) => (
                                <div
                                    key={room._id}
                                    id={`room-card-${room._id}`}
                                    onClick={() => router.push(`/chat/room/${room._id}`)}
                                    onMouseEnter={() => setHoveredRow(room._id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    style={{
                                        display: 'flex', alignItems: 'center',
                                        padding: '10px 16px', gap: '16px',
                                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                                        background: hoveredRow === room._id ? '#1a1a1f' : 'transparent',
                                        cursor: 'pointer',
                                        transition: 'background 0.12s',
                                    }}
                                >
                                    <div style={{ flex: 2, minWidth: 0 }}>
                                        <span style={{
                                            fontSize: '13px', fontWeight: 400,
                                            color: '#e4e4e7',
                                            overflow: 'hidden', textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap', display: 'block',
                                        }}>
                                            {room.name}
                                        </span>
                                        {room.description && (
                                            <span style={{
                                                fontSize: '11px', color: '#52525b',
                                                overflow: 'hidden', textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap', display: 'block',
                                                marginTop: '2px',
                                            }}>
                                                {room.description}
                                            </span>
                                        )}
                                    </div>
                                    <span style={{
                                        flex: 1, fontSize: '12px', fontWeight: 400,
                                        color: '#71717a',
                                        overflow: 'hidden', textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {room.createdBy?.username ?? "—"}
                                    </span>
                                    <span style={{
                                        width: '80px', fontSize: '11px', fontWeight: 400,
                                        color: '#52525b', textAlign: 'right',
                                    }}>
                                        {formatRelativeTime(room.createdAt)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <CreateRoomModal
                    theme="dark"
                    onClose={() => setShowModal(false)}
                    onCreated={handleRoomCreated}
                />
            )}
        </>
    )
}
