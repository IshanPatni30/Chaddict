const express=require('express');
const app=express();
const http=require('http');
const path=require('path');
const server=http.createServer(app);
const socketio=require('socket.io');
const io=socketio(server);
const formatMessage=require('./utils/messages');
const {userJoin,getCurrentUser, userLeave, getRoomUsers}=require('./utils/users');


//set static folder

app.use(express.static(path.join(__dirname,'public')))
const botName='ChatBot';

//run when a client connects
io.on('connection',socket=>{
    socket.on('joinRoom',({username,room})=>{
        const user=userJoin(socket.id,username,room);
        socket.join(user.room);


         //Welcome current user
    socket.emit('message',formatMessage(botName,'welcome to ChatCord'));

    //broadcast when a user connects
    socket.broadcast.to(user.room).emit('message',formatMessage(botName,` ${user.username} has Joined the chat`));

     //send users and Room info
  io.to(user.room).emit('roomUsers',{
    room:user.room,
    users: getRoomUsers(user.room)
});

    })
 
   

    //listen to the chat message
    socket.on('chatMessage',msg=>{
        const user=getCurrentUser(socket.id);
       io.to(user.room).emit('message',formatMessage(user.username,msg));
    })
     //runs when client disconnects
     socket.on('disconnect',()=>{
         const user=userLeave(socket.id);
         if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`))
        io.to(user.room).emit('roomUsers',{
      room:user.room,
      users: getRoomUsers(user.room)
  });
        
        }
       
    })
});
const PORT= process.env.PORT||3000;
server.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
