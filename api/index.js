const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const RoomManage = require('./src/modules/room')
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
let roomidx = 0
const roomName = 'room'

io.on('connection', (socket) => {
  
  const roomModule = RoomManage(socket)
  const {craeteNewRoom,joinRoom,leaveRoom,roomIsFull,hasRoom} = roomModule
  
  socket.emit('connected',socket.id)

  socket.on('setname',(name)=>{
    console.log(name);
    socket.username = name
    socket.emit('setname',name)
  })

  socket.on('chat', (msg) => {
    if(socket.roomid ){
      if(msg.trim()==''){
        socket.to(socket.roomid).emit('chat',{status:400,msg:`enter your text !!`})
        return
      }
      io.emit('date',{status:200,msg:`at date ${new Date().toLocaleTimeString()}`})
      socket.emit('chat',{status:200,msg:{user:'you',text:msg}})
      socket.to(socket.roomid).emit('chat',{status:200,msg:{user:socket.username||socket.id,text:msg}})
      return
    }
    socket.emit('chat',{status:400,msg:'please select room or create room'})
  });

  socket.on('create room', (roomId) => {
  if(!hasRoom(roomId)){
    craeteNewRoom(roomId)
    socket.emit('create room',{status:200,id:`${socket.roomid}`})
    return
  }
  socket.emit('create room',{status:400,id:``})
  });

  socket.on('join room', (roomId) => {
    if(!roomIsFull(roomId)){
      const success =  joinRoom(roomId)
      if(success){
        socket.emit('join room',{status:200,id:`${socket.roomid}`})
        return
      }
    }
      socket.emit('join room',{status:400,id:``})
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    leaveRoom()
  });

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});