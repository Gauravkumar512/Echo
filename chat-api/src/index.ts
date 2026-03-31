import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';    
import dotenv from 'dotenv';
import connectDb from './config/db';
import cookieParser from 'cookie-parser';
dotenv.config()

const port = process.env.PORT
const app = express()

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        credentials: true
    }
})

app.use(cors({
    origin: '*',
    credentials: true
}))
app.use(cookieParser())

// common middlewares

app.use(express.json())
app.use(express.urlencoded({extended: true, limit: '50mb'}))
app.use(express.static('public'))

// routes


const main = async ()=>{
    await connectDb()
    server.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
    })
}

main()