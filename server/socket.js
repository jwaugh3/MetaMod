const {
    userJoin,
    getCurrentUser,
    checkRoom,
    userLeave,
    getRoomUsers
  } = require('./utils/roomUsers/roomManagement');
const express = require('express');
const app = express();
const cors = require('cors');
const server = app.listen(8888, process.env.LOCAL_HOST, ()=>{
    console.log('listening on 8888')
});
const http = require('http').createServer(app);
const io = require('socket.io').listen(server);
app.use(cors({ origin: '*' }));
require('dotenv').config()

io.set('origins', process.env.FRONT_END_URL);

//send twitch chat to client
const passChatMsg = (msgData) => {
    if(checkRoom(msgData.channel)){
        io.to(msgData.channel).emit(msgData.channel, (msgData))
        console.log('sent to', msgData)
    }
}

//handle moderator messages
io.on('connection', (socket) => {
    console.log('connected to client')
    socket.on('join', ({username, room, profileImage, emotes})=>{
        const user = userJoin(socket.id, username, room, profileImage, emotes)

        socket.join(user.room)

        //Broadcast when a user connects
        io.to(user.room).emit('newModMsg', {username: user.username, time: 'three', userType: 'serverJoin', modMsg: '', sentBy: 'server' })

        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room, 
            users: getRoomUsers(user.room)
        })
    })
   
    socket.on('modMsg', (msg)=>{
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('newModMsg', msg) 
    })

    //handle disconnect
    socket.on('disconnect', ()=>{
        const user = userLeave(socket)

        if(user){
            socket.broadcast.to(user.room).emit('newModMsg', { username: user.username, time: 'three', userType: 'serverLeave', modMsg: '', sentBy: 'server' })
 
            io.to(user.room).emit('roomUsers', { 
                room: user.room,
                users: getRoomUsers(user.room)  
            }) 
        }   
    })

    socket.on('leaveRoom', ()=>{ 
        const user = userLeave(socket) 

        if(user){
            socket.in(user.room).emit('newModMsg', { username: user.username, time: 'three', userType: 'serverLeave', modMsg: '', sentBy: 'server' })

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)   
            })  
        }

    })
 
}) 
 
module.exports = {
    passChatMsg 
}