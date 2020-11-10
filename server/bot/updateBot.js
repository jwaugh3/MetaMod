const { User } = require('../models/dbModels');
const { updateOpts } = require('./bot');

const getChannels = () =>{
    User.find({}).then((users) => {
        let channelList = []
        users.map((user)=>{
            channelList.push(user.login_username)
        })
        updateOpts('add', channelList)
    })
}

module.exports = {
    getChannels
}