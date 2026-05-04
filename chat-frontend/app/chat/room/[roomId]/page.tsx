"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import OnlineUsers from "@/components/chat/OnlineUsers";
import { useSocket } from "@/hooks/useSocket";
import { useMessages, type RoomMeta } from "@/hooks/useMessages";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { apiClient } from "@/lib/api";
import { socket } from "@/lib/socket";

type RoomDetails = {
    name: string;
    createdAt?: string;
    createdBy?: { username?: string };
};

export default function RoomPage() {
    const params = useParams();
    const router = useRouter();
    const roomId = params.roomId as string;

    const [roomName, setRoomName] = useState("Loading...");
    const [roomMeta, setRoomMeta] = useState<RoomMeta>(null);

    useSocket(roomId);

    const { items, isLoading } = useMessages(roomId, roomMeta);
    const { onlineUsers } = useOnlineUsers(roomId);

    useEffect(() => {
        const fetchRoomDetails = async () => {
            if (!roomId) return;
            try {
                const response = await apiClient.get(`/room/${roomId}`);
                const data = response.data.data as RoomDetails;
                setRoomName(data.name);
                setRoomMeta({
                    creatorUsername: data.createdBy?.username,
                    createdAt: data.createdAt,
                });
            } catch (error) {
                console.error("Failed to fetch room details", error);
                setRoomName("Unknown room");
                setRoomMeta(null);
            }
        };

        fetchRoomDetails();
    }, [roomId]);

    if (!roomId) return null;

    return (
        <div style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden' }}>
            <div style={{ display: 'flex', minWidth: 0, flex: 1, flexDirection: 'column' }}>
                <div style={{
                    display: 'flex', height: '48px', flexShrink: 0,
                    alignItems: 'center', padding: '0 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    background: '#0a0a0f',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <h2 style={{
                            fontSize: '13px', fontWeight: 500,
                            color: '#e4e4e7', letterSpacing: '-0.01em', margin: 0,
                        }}>
                            {roomName}
                        </h2>
                    </div>
                    {roomMeta?.creatorUsername && (
                        <span style={{
                            marginLeft: '16px', fontSize: '11px', color: '#52525b',
                            borderLeft: '1px solid rgba(255,255,255,0.06)', paddingLeft: '16px',
                        }}>
                            Created by {roomMeta.creatorUsername}
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={() => {
                            socket.emit("leave-room", roomId);
                            router.push("/chat");
                        }}
                        style={{
                            marginLeft: "auto",
                            background: "none",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "4px",
                            padding: "4px 10px",
                            fontSize: "11px",
                            fontWeight: 500,
                            color: "#71717a",
                            cursor: "pointer",
                            transition: "color 0.15s, border-color 0.15s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#e4e4e7";
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = "#71717a";
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                        }}
                        title="Leave room"
                    >
                        Leave room
                    </button>
                </div>

                <MessageList items={items} isLoading={isLoading} />
                <MessageInput roomId={roomId} />
            </div>

            <div style={{ display: 'none' }} className="lg-block">
                <OnlineUsers users={onlineUsers} />
            </div>
            <div className="hidden lg:flex">
                <OnlineUsers users={onlineUsers} />
            </div>
        </div>
    );
}
