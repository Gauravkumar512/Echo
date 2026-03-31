import { Server, Socket } from "socket.io"
import type { IUser } from "../models/User"

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}


export interface ServerToClientEvents {
    "receive-message": (data: {
        _id: string
        content: string
        sender: { _id: string; username: string; avatar?: string }
        avatar?: string
        room: string
        createdAt: Date
    }) => void
    "user-joined": (data: { userId: string; username: string }) => void
    "user-left": (data: { userId: string; username: string }) => void
    "online-users": (data: { users: string[] }) => void
}

export interface ClientToServerEvents {
    "join-room": (roomId: string) => void
    "leave-room": (roomId: string) => void
    "send-message": (data: { roomId: string; content: string }) => void
}

export interface InterServerEvents {}

export interface SocketData {
    user: {
        _id: string
        username: string
    }
}

export type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
export type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>

export type { Request, Response, NextFunction, RequestHandler } from "express"

export {}

