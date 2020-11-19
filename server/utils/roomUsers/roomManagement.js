const users = []

//Join user to chat
const userJoin = (id, username, room, profileImage) => {
    const user = { id, username, room, profileImage }
    users.push(user)
console.log(users)
    return user
}

//Get current user
const getCurrentUser = (id) => { 
    return users.find(user => user.id === id);
}

//Check for room
const checkRoom = (channel) => {
    return users.find(user => user.room === channel)
}

//User leaves chat
const userLeave = (socket) => {
    const index = users.findIndex(user => user.id === socket.id);

    if(users[index]){
        socket.leave(users[index].room)
    }

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

//Get room users
const getRoomUsers = (room) => {
    return users.filter(user => user.room === room)
}

module.exports = {
    userJoin,
    getCurrentUser,
    checkRoom,
    userLeave,
    getRoomUsers
}
