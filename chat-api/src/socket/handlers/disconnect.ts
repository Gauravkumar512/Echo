import type { TypedServer,TypedSocket } from "../../types";

const disconnect = (io: TypedServer,socket: TypedSocket) => {
    socket.on('disconnect', (reason: string) => {
        console.log(`${socket.data.user.username} disconnected: ${reason}`);
    });
};

export default disconnect;


// TODO: remove user from Redis online set