const { client } = require('../../bot/bot');
const { ChannelAccess } = require('../../models/dbModels');

const manageChannelAccess = (username) => {
    client.mods(username)
    .then((data)=>{
        // console.log('data', data)

        //get users channel access
        ChannelAccess.findOne({login_username: username}).then((existingLogin)=>{
            if(!existingLogin){
                new ChannelAccess({
                    login_username: username,
                    channel_access: [username]
                })
                .save()
                .then((user)=>{
                    // console.log('user', user)
                })
            } else {
                let newAccess = data
                newAccess.push(username)
                ChannelAccess.findOneAndUpdate({login_username: username}, {channel_access: newAccess}, {new: true, useFindAndModify: false})
            }
        })

        //create or update all mods channel access
        data.forEach(async (mod)=>{
            // console.log(mod)

            ChannelAccess.findOne({'login_username':mod}).then((userCheck)=>{
                if(userCheck && userCheck.channel_access.includes(username)){
                    // console.log('access already exists, no need to modify')
                } else {
                    ChannelAccess.findOneAndUpdate({'login_username': mod}, {$push: {channel_access: username}}, {useFindAndModify: false}).then((user)=>{
                        if(user){
                            // console.log('user', user)
                        } else {
                            new ChannelAccess({
                                login_username: mod,
                                channel_access: [mod, username]
                            })
                            .save()
                            .then((newUser)=>{
                                // console.log(newUser)
                            })
                        }
                    })
                }
            })
        }) 
    })
}

module.exports = {
    manageChannelAccess
}