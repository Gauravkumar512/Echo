import type { TypedServer,TypedSocket } from "../../types";

const joinRoom = (io: TypedServer,socket: TypedSocket) => {

    socket.on('join-room', (roomId: string) => {

        socket.join(roomId);

        socket.to(roomId).emit('user-joined', {
            username: socket.data.user.username,
            userId: socket.data.user._id
        });
        console.log(`${socket.data.user.username} joined room ${roomId}`);
    })

    socket.on('leave-room', (roomId: string)=>{

        socket.leave(roomId);

        socket.to(roomId).emit('user-left', {
            username: socket.data.user?.username,
            userId: socket.data.user?._id
        })
        console.log(`${socket.data.user?.username} left room ${roomId}`);
    })
};

export default joinRoom;