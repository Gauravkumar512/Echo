"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface IRoom {
    _id: string;
    name: string;
    description?: string;
}

interface RoomListProps {
    rooms: IRoom[];
}

export default function RoomList({ rooms }: RoomListProps) {
    const pathname = usePathname();
    const match = pathname?.match(/^\/chat\/room\/([^/]+)/);
    const activeRoomId = match?.[1];
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

                return (
                    <li key={room._id}>
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
                    </li>
                );
            })}
        </ul>
    );
}
