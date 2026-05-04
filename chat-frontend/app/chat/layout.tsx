'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { connectSocket, socket } from '@/lib/socket';
import RoomList from '@/components/chat/RoomList';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Toast, { type ToastItem } from '@/components/ui/Toast';
import CreateRoomModal from '@/components/chat/CreateRoomModal';
import type { IRoom as IRoomType, IRoom as IRoomApi } from '@/types';
import axios from 'axios';
import { clearAuthToken } from '@/lib/authStorage';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    const [isHydrating, setIsHydrating] = useState(true);
    const [rooms, setRooms] = useState<IRoomType[]>([]);
    const [createOpen, setCreateOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDelete, setPendingDelete] = useState<{ id: string; name?: string } | null>(null);
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const router = useRouter();
    const { user, setUser } = useAuthStore();

    useEffect(() => {
        const verifyAndHydrate = async () => {
            try {
                
                const [userRes, roomsRes] = await Promise.all([
                    apiClient.get('/auth/me'),
                    apiClient.get('/room')
                ]);
                
                setUser(userRes.data.data);
                setRooms(roomsRes.data.data || []);

                connectSocket();
                setIsHydrating(false);
            } catch {
                console.error("Hydration failed, redirecting to login");
                clearAuthToken();
                setUser(null);
                router.push('/login');
            }
        };

        verifyAndHydrate();
    }, []);

    useEffect(() => {
        const onRoomCreated = (payload: { room: IRoomApi }) => {
            const r = payload.room;
            setRooms((prev) => {
                if (prev.some((x) => x._id === r._id)) return prev;
                return [
                    { _id: r._id, name: r.name, description: r.description, createdBy: r.createdBy, createdAt: r.createdAt },
                    ...prev,
                ];
            });
        };
        socket.on('room-created', onRoomCreated);
        const onRoomDeleted = (payload: { id: string }) => {
            const removedId = payload.id;
            setRooms((prev) => prev.filter((r) => r._id !== removedId));
            const inRoom = typeof window !== 'undefined' && window.location.pathname.startsWith(`/chat/room/${removedId}`);
            if (inRoom) {
                const toastId = `deleted-${removedId}-${Date.now()}`;
                setToasts((t) => [...t, { id: toastId, text: 'This room was deleted — redirecting...' }]);
                setTimeout(() => {
                    setToasts((t) => t.filter((x) => x.id !== toastId));
                    router.push('/chat');
                }, 1200);
            }
        };
        socket.on('room-deleted', onRoomDeleted);
        return () => {
            socket.off('room-created', onRoomCreated);
            socket.off('room-deleted', onRoomDeleted);
        };
    }, []);

    const handleDeleteRoom = async (id: string) => {
        try {
            await apiClient.delete(`/room/${id}`);
            setRooms((prev) => prev.filter((r) => r._id !== id));
            // owner who deleted can be redirected immediately
            if (typeof window !== 'undefined' && window.location.pathname.startsWith(`/chat/room/${id}`)) {
                const toastId = `deleted-owner-${id}-${Date.now()}`;
                setToasts((t) => [...t, { id: toastId, text: 'You deleted this room — redirecting...' }]);
                setTimeout(() => {
                    setToasts((t) => t.filter((x) => x.id !== toastId));
                    router.push('/chat');
                }, 600);
            }
        } catch (error) {
            console.error('Failed to delete room', error);
        }
    };

    const requestDeleteRoom = (id: string, name?: string) => {
        setPendingDelete({ id, name });
        setConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!pendingDelete) return;
        setConfirmOpen(false);
        const id = pendingDelete.id;
        setPendingDelete(null);
        await handleDeleteRoom(id);
    };

    const handleLogout = async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            if (!axios.isAxiosError(error) || error.response?.status !== 401) {
                console.error("Logout failed", error);
            }
        } finally {
            socket.disconnect();
            clearAuthToken();
            setUser(null);
            router.push('/');
        }
    };

    if (isHydrating) {
        return (
            <div style={{
                display: 'flex', height: '100vh', width: '100%',
                alignItems: 'center', justifyContent: 'center',
                background: '#0a0a0f',
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: 24, height: 24, borderRadius: '50%',
                        border: '2px solid #333', borderTopColor: '#71717a',
                        animation: 'spin 0.7s linear infinite',
                    }} />
                    <p style={{
                        fontSize: '12px', fontWeight: 500,
                        letterSpacing: '0.04em', color: '#52525b',
                    }}>
                        Connecting…
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            height: '100vh', width: '100%',
            background: '#0a0a0f', color: '#e4e4e7',
            overflow: 'hidden', fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif',
        }}>

            <nav style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                height: '48px', padding: '0 20px', flexShrink: 0,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: '#0a0a0f',
            }}>
                <div
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        cursor: 'pointer',
                    }}
                    onClick={() => router.push('/chat')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 16, height: 16, color: '#e4e4e7' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                    </svg>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>Echo</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 400, color: '#71717a' }}>
                        {user?.username}
                    </span>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'none', border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '4px', padding: '4px 10px',
                            fontSize: '11px', fontWeight: 500, color: '#71717a',
                            cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#e4e4e7';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#71717a';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                        }}
                        title="Log out"
                    >
                        Log out
                    </button>
                </div>
            </nav>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                <aside style={{
                    display: 'flex', width: '220px', flexShrink: 0,
                    flexDirection: 'column',
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                    background: '#111',
                }}>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px 8px' }} className="hide-scrollbar">
                        <p style={{
                            fontSize: '10px', fontWeight: 500,
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                            color: '#52525b', padding: '0 12px', marginBottom: '8px',
                        }}>
                            Channels
                        </p>
                        <RoomList rooms={rooms} onDelete={(id) => requestDeleteRoom(id, rooms.find(r => r._id === id)?.name)} />
                    </div>

                    <div style={{
                        padding: '12px 16px',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                    }}>
                        <button
                            type="button"
                            onClick={() => setCreateOpen(true)}
                            style={{
                                background: 'none', border: 'none',
                                fontSize: '12px', fontWeight: 500, color: '#52525b',
                                cursor: 'pointer', padding: '4px 0',
                                transition: 'color 0.15s',
                                display: 'flex', alignItems: 'center', gap: '6px',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#e4e4e7'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#52525b'; }}
                        >
                            <span style={{ fontSize: '14px', lineHeight: 1 }}>+</span>
                            New Channel
                        </button>
                    </div>
                </aside>

                <main style={{
                    position: 'relative', display: 'flex',
                    flex: 1, flexDirection: 'column', overflow: 'hidden',
                    background: '#0a0a0f',
                }}>
                    {children}
                </main>
            </div>

            {createOpen && (
                <CreateRoomModal
                    theme="dark"
                    onClose={() => setCreateOpen(false)}
                    onCreated={(room) => {
                        setRooms((prev) => {
                            if (prev.some((x) => x._id === room._id)) return prev;
                            return [room as unknown as IRoomType, ...prev];
                        });
                        setCreateOpen(false);
                        router.push(`/chat/room/${room._id}`);
                    }}
                />
            )}
            <ConfirmModal
                open={confirmOpen}
                title={pendingDelete ? `Delete ${pendingDelete.name ?? 'channel'}?` : 'Delete channel?'}
                description={pendingDelete ? `This will permanently delete the channel "${pendingDelete.name ?? ''}" and remove it for everyone.` : undefined}
                confirmLabel="Delete"
                onClose={() => { setConfirmOpen(false); setPendingDelete(null); }}
                onConfirm={confirmDelete}
            />

            <Toast items={toasts} />
        </div>
    );
}