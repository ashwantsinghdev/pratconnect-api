import { Server } from "socket.io";

const VideoSocket=(io:Server)=>{
    io.on("connection",(socket)=>{
        socket.on("offer",({offer,to,from,type})=>{
            from.socketId=socket.id;
            io.to(to).emit("offer",{offer,from,type})
        })

        socket.on("candidate",({candidate,to})=>{
            io.to(to).emit("candidate",{candidate,from:socket.id})

        })
        socket.on("answere",({answere,to})=>{
            io.to(to).emit("answere",{answere,from:socket.id})

        })

        socket.on("end",({to})=>{
            io.to(to).emit("end",{from:socket.id})
        })

    })
}

export default VideoSocket