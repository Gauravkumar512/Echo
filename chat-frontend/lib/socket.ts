import { Socket, io } from "socket.io-client"

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL

export const socket: Socket = io(socketUrl, {
    autoConnect: false,
    withCredentials: true,
})

export const connectSocket = (): Socket => {
    if (!socket.connected) {
        socket.connect()
    }

    return socket
}

export default connectSocket