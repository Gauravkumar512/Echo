'use client';

import { useState } from 'react';
import { socket } from '@/lib/socket';

interface MessageInputProps {
    roomId: string;
}

export default function MessageInput({ roomId }: MessageInputProps) {
    const [content, setContent] = useState('');

    const handleSend = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        if (!content.trim()) return;

        socket.emit('send-message', { roomId, content });
        
        setContent('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '12px 20px',
            background: '#0a0a0f',
        }}>
            <form onSubmit={handleSend} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    style={{
                        flex: 1,
                        background: '#111',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '10px 14px',
                        fontSize: '13px',
                        color: '#e4e4e7',
                        outline: 'none',
                        fontFamily: 'inherit',
                    }}
                    autoComplete="off"
                />
                <button
                    type="submit"
                    disabled={!content.trim()}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: '6px',
                        background: content.trim() ? '#fff' : '#1a1a1f',
                        color: content.trim() ? '#111' : '#52525b',
                        border: 'none',
                        cursor: content.trim() ? 'pointer' : 'default',
                        transition: 'background 0.15s, color 0.15s',
                        flexShrink: 0,
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16 }}>
                        <path d="M3.105 2.289a.75.75 0 0 0-.826.95l1.414 4.925A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.896 28.896 0 0 0 15.293-7.154.75.75 0 0 0 0-1.115A28.897 28.897 0 0 0 3.105 2.289Z" />
                    </svg>
                </button>
            </form>
        </div>
    );
}