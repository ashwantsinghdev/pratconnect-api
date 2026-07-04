import { Server } from "socket.io";
import { Error } from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as cookie from "cookie";

const onlineUser = new Map();

const StatusSocket = (io: Server) => {
  io.on("connection", (socket) => {
    try {
      const rawCookie = socket.handshake.headers.cookie ||"";
      const cookies = cookie.parse(rawCookie);
      const accessToken = cookies.accessToken;

      if (!accessToken) throw new Error("Access token not found");

      const user = jwt.verify(
        accessToken,
        process.env.AUTH_SECRET!,
      ) as JwtPayload;
      onlineUser.set(socket.id, user);

      socket.join(user.id);

      io.emit("online", Array.from(onlineUser.values()));

      socket.on("get-online", () => {
        io.emit("online", Array.from(onlineUser.values()));
      });

      socket.on("disconnect", () => {
        onlineUser.delete(socket.id);
        io.emit("online", Array.from(onlineUser.values()));
      });
    } catch (err) {
        if(err instanceof Error)
            socket.disconnect()
    }
  });
};

export default StatusSocket
