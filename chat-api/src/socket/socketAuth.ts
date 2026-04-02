import jwt, {JwtPayload} from "jsonwebtoken";
import { Socket } from "socket.io";

interface customJwtPayload extends JwtPayload{
    _id: string;
    username: string;
}


const socketAuth = (socket: Socket, next: (err?: Error)=> void) =>{

    const token = socket.handshake.query.token as string

    if(!token){
        return next(new Error("Unauthorized"))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as customJwtPayload

        socket.data.user = {
            _id: decoded._id,
            username: decoded.username,
        }
        
        next()
    } catch (error: any) {
        next(new Error(`Invalid token: ${error.message}`));
    }


}

export default socketAuth