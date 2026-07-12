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
import PostRouter from "./router/post.router"
import ChatRouter from "./router/chat.router"
import ChatSocket from "./socket/chat.socket"
import VideoSocket from "./socket/video.socket"
import TwilioRouter from "./router/twilio.router"


const app = express();
const server = createServer(app);
server.listen(process.env.PORT || 8080);

const io=new Server(server,{cors:corsConfig})
StatusSocket(io);
ChatSocket(io);
VideoSocket(io);


app.use(cors(corsConfig));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));




app.use("/auth",AuthRouter)
app.use("/storage",AuthMiddleware,StorageRouter)
app.use("/friend", AuthMiddleware, FriendRouter);
app.use("/chat",AuthMiddleware, ChatRouter);
app.use("/post", AuthMiddleware, PostRouter);
app.use("/twilio", AuthMiddleware, TwilioRouter);





