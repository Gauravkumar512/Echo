import { Socket, io } from "socket.io-client"

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL

export const socket: Socket = io(socketUrl, {
    autoConnect: false,
    withCredentials: true,
})

export default socket