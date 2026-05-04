"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from '@/store/useAuthStore';
import type { IRoom } from '@/types';

interface RoomListProps {
    rooms: IRoom[];
    onDelete?: (id: string) => void;
}

export default function RoomList({ rooms, onDelete }: RoomListProps) {
    const pathname = usePathname();
    const match = pathname?.match(/^\/chat\/room\/([^/]+)/);
    const activeRoomId = match?.[1];
    const { user } = useAuthStore();

    const sortedRooms = [...rooms].sort((a, b) => {
        const aIsGeneral = a.name.trim().toLowerCase() === "general chat";
        const bIsGeneral = b.name.trim().toLowerCase() === "general chat";
        if (aIsGeneral && !bIsGeneral) return -1;
        if (!aIsGeneral && bIsGeneral) return 1;
        return 0;
    });

    if (!rooms || rooms.length === 0) {
        return <div className="px-3 py-4 text-xs text-zinc-600">No rooms yet. Create one below.</div>;
    }

    return (
        <ul className="mt-1 flex flex-col">
            {sortedRooms.map((room) => {
                const isActive = activeRoomId === room._id;
                const isOwner = !!(user && room.createdBy && user._id === room.createdBy._id);

                return (
                    <li key={room._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Link
                            href={`/chat/room/${room._id}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '6px 12px',
                                fontSize: '13px',
                                fontWeight: 400,
                                color: isActive ? '#fff' : '#71717a',
                                borderLeft: isActive ? '2px solid #e5e7eb' : '2px solid transparent',
                                background: 'transparent',
                                transition: 'color 0.15s, border-color 0.15s',
                                textDecoration: 'none',
                                flex: 1,
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.color = '#a1a1aa';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.color = '#71717a';
                                }
                            }}
                        >
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {room.name}
                            </span>
                        </Link>

                        {isOwner && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (onDelete) onDelete(room._id);
                                }}
                                title="Delete channel"
                                style={{
                                    background: 'transparent',
                                    border: '1px solid rgba(239,68,68,0.15)',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    padding: '4px 8px',
                                    fontSize: '12px',
                                    borderRadius: '4px',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#ef4444';
                                    e.currentTarget.style.color = '#fff';
                                    e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#ef4444';
                                    e.currentTarget.style.borderColor = 'rgba(239,68,68,0.15)';
                                }}
                            >
                                Delete
                            </button>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
