const room = {}
const maxUser = 3
module.exports = function RoomManage(socket){
  function craeteNewRoom(roomId){
    if(!hasRoom(roomId)){
      room[roomId]=[]
      joinRoom(roomId)
    }
  }
  function roomIsFull(roomId){
    return hasRoom(roomId) && room[roomId].length >=maxUser
  } 
  function hasRoom(roomId){
    return !!room[roomId]
  }
  function hasUserInRoom(roomId){
  return hasRoom(roomId) && room[roomId].findIndex(x=>x===socket.id) > -1
  }
  function joinRoom(roomId){
    if(hasRoom(roomId) && room[roomId].length <maxUser){
      if(room[roomId].findIndex(x=>x===socket.id) === -1){
        room[roomId].push(socket.id)
        socket.roomid = roomId
        socket.join(roomId)
        return true
      }
      else{
        return false
      }
    }
    else{
      return false
    }
  }
  function leaveRoom(){
    if(hasRoom(socket.roomid) && hasUserInRoom(socket.roomid)){
      room[socket.roomid] = room[socket.roomid].filter(x=>x!==socket.id)
      console.log(`remove user ${socket.id}`);
      console.log(`room ${socket.roomid}: has user =>${room[socket.roomid]}`);
    }
    else{
      console.log('him not have room');
    }
    deleteRoom()
  }
  function deleteRoom(){
    if(room[socket.roomid]?.length===0){
      delete room[socket.roomid] 
      console.log(`room ${socket.roomid} has delete`);
      console.log(room);
    } 
  }
  return{
    craeteNewRoom,
    joinRoom,
    roomIsFull,hasRoom,
    leaveRoom
  }
}