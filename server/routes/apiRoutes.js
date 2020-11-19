const router = require('express').Router();
const request = require('request');
const { User, ChannelAccess, BttvEmote, FfzEmote } = require('../models/dbModels');
const { client } = require('../bot/bot');

router.get('/userData/:id', (req, res)=>{

    User.findOne({ twitch_ID: req.params.id }).then((singleUser)=>{

        ChannelAccess.findOne({login_username: singleUser.login_username}).then((access)=>{

            User.find({login_username: {$in: access.channel_access}}).then((accessableUsers)=>{
                let channelAccess = []

                access.channel_access.forEach((channel)=>{

                    let index = accessableUsers.findIndex((user) => {return (user.login_username === channel)})

                    if(index != -1){
                        channelAccess.push({channel: channel, channelImage: accessableUsers[index].profile_image })
                    }
                })

                let returnUserData = { 
                    username: singleUser.display_name, 
                    profileImage: singleUser.profile_image, 
                    login_username: singleUser.login_username,
                    channelAccess: channelAccess
                }

                res.json(returnUserData)
            })
        })
    })
})

router.get('/getMods/:channel', async (req, res) => {

    client.mods(req.params.channel)
        .then((data)=>{
            res.json({mods: data})
        })
        .catch((err)=>{
            console.log(err)
        })
})

router.get('/getBttvEmotes/:channel', (req, res) => {

    BttvEmote.find({channel_name: {$in: ['global', req.params.channel]}})
    .then((results)=>{
        if(results.length > 1){
            let emotes = results[0].emotes.concat(results[1].emotes)
            res.json(emotes)
        } else  {
            let emotes = results[0].emotes
            res.json(emotes)
        }
    })
})

router.get('/getFfzEmotes/:channel', (req, res) => {

    FfzEmote.find({channel_name: {$in: ['global', req.params.channel]}})
    .then((results)=>{
        if(results.length > 1){
            let emotes = results[0].emotes.concat(results[1].emotes)
            res.json(emotes)
        } else  {
            let emotes = results[0].emotes
            res.json(emotes)
        }
    })
}) 

module.exports = router;  