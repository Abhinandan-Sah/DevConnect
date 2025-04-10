const socket = require("socket.io")

const initilizeSocket = (server) => {

const io = socket(server, {
    cors:{
      origin: "http://localhost:5173"
    }
  })
  
  io.on("connection", (socket)=>{
    // Handle events
    socket.on("joinChat", ({firstName, userId, targetUserId})=>{
        const roomId = [userId, targetUserId].sort().join("_");
        console.log(firstName+" Joined Room: "+ roomId)
        socket.join(roomId);
    });

    socket.on("sendMessage", ()=>{});

    socket.on("disconnect", ()=>{});
  });

}

module.exports = initilizeSocket;