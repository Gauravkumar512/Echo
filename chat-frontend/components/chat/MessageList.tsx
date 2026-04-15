"use client";

import { useEffect, useRef } from "react";
import type { ChatItem } from "@/hooks/useMessages";
import { useAuthStore } from "@/store/useAuthStore";

interface MessageListProps {
    items: ChatItem[];
    isLoading: boolean;
}

export default function MessageList({ items, isLoading }: MessageListProps) {
    const { user } = useAuthStore();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [items]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    border: '2px solid #333', borderTopColor: '#71717a',
                    animation: 'spin 0.7s linear infinite'
                }} />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div style={{
                display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center',
                color: '#52525b', fontSize: '13px'
            }}>
                <p>No messages yet. Be the first to say hello.</p>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex', flex: 1, flexDirection: 'column', gap: '2px',
            overflowY: 'auto', padding: '16px 20px',
        }} className="hide-scrollbar">
            {items.map((item) => {
                if (item.type === "system") {
                    return (
                        <div key={item._id} style={{
                            display: 'flex', width: '100%', justifyContent: 'center', padding: '8px 0'
                        }}>
                            <span style={{
                                fontSize: '11px', fontWeight: 500, color: '#52525b',
                                letterSpacing: '0.02em',
                            }}>
                                {item.text}
                            </span>
                        </div>
                    );
                }

                const isMe = item.sender._id === user?._id;

                return (
                    <div
                        key={item._id}
                        style={{
                            display: 'flex', width: '100%',
                            justifyContent: isMe ? 'flex-end' : 'flex-start',
                            marginBottom: '6px',
                        }}
                    >
                        <div style={{
                            display: 'flex', maxWidth: '70%', flexDirection: 'column',
                            gap: '3px', alignItems: isMe ? 'flex-end' : 'flex-start',
                        }}>
                            {!isMe && (
                                <span style={{
                                    marginLeft: '2px', fontSize: '11px', fontWeight: 500,
                                    color: '#71717a', letterSpacing: '0.01em',
                                }}>
                                    {item.sender.username}
                                </span>
                            )}

                            <div style={{
                                padding: '8px 14px', fontSize: '13px', lineHeight: '1.5',
                                borderRadius: isMe ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                                background: isMe ? '#ffffff' : '#1a1a1f',
                                color: isMe ? '#111' : '#a1a1aa',
                                border: isMe ? 'none' : '1px solid rgba(255,255,255,0.06)',
                            }}>
                                {item.content}
                            </div>
                        </div>
                    </div>
                );
            })}

            <div ref={bottomRef} />
        </div>
    );
}
