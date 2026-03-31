import { Server } from "socket.io";

import type { Server as HttpServer } from "http";

export const initSocket = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    return io;
};

