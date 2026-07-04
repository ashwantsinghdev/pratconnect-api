import dotenv from "dotenv"
dotenv.config()

import mongoose from "mongoose"
mongoose.connect(process.env.DB!)

import  express  from "express"
import { createServer } from "http"
import cors from "cors"
import cookieParser from "cookie-parser"
import AuthRouter from "./router/auth.router"
import corsConfig from "./utils/cors"
import AuthMiddleware from "./middleware/auth.middleware"
import StorageRouter from "./router/storage.router"
import FriendRouter from "./router/friend.router"
import StatusSocket from "./socket/status.socket"
import { Server } from "socket.io"


const app = express();
const server = createServer(app);
server.listen(process.env.PORT || 8080);
const io=new Server(server,{cors:corsConfig})


app.use(cors(corsConfig));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));




app.use("/auth",AuthRouter)
app.use("/storage",AuthMiddleware,StorageRouter)
app.use("/friend", AuthMiddleware, FriendRouter);


StatusSocket(io)

