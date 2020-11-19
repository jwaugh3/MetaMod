const {
    userJoin,
    getCurrentUser,
    checkRoom,
    userLeave,
    getRoomUsers
  } = require('./utils/roomUsers/roomManagement');
const express = require('express');
const app = express();
//const cors = require('cors');
//app.use(cors({ origin: process.env.FRONT_END_URL }));
app.use(function(req, res, next) {
        // Website you wish to allow to connect
        res.header('Access-Control-Allow-Origin', "https://metamoderation.com" );

        // Request methods you wish to allow
        res.header('Access-Control-Allow-Methods', 'GET, POST');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.header('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
});

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
	path: '/socket'
});

require('dotenv').config()

//io.set('origins', process.env.FRONT_END_URL);

//send twitch chat to client
const passChatMsg = (msgData) => {
    if(checkRoom(msgData.channel)){
        io.to(msgData.channel).emit(msgData.channel, (msgData))
    }
}

//handle moderator messages
io.on('connection', (socket) => {
    
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

http.listen(8888, process.env.LOCAL_HOST, ()=>{
	console.log('listening on port 8888')
})
 
module.exports = {
    passChatMsg 
}
