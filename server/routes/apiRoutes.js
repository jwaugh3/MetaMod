const router = require('express').Router();
const { User, ChannelAccess, BttvEmote, FfzEmote, ModerationRecord } = require('../models/dbModels');
const { client } = require('../bot/bot');
const { generateNewAccessToken } = require('./authRoutes');
const request = require('request');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
require('dotenv').config()

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

router.get('/getModRecords/:channel', (req, res) => {
    //get all mod logs for channel without mongo id
    ModerationRecord.find({channel: '#' + req.params.channel}, { _id: 0 })
    .then((results)=>{
        if(results.length === 0){
            res.json(null)
        } else {
            let records = results
            res.json(records)
        }
    })
})

router.post('/createCustomRewards', jsonParser, (req, res)=>{

    User.findOne({ login_username: req.body.channel }).then(async (existingUser)=>{
        if(existingUser){
            let twitchResponse = await generateNewAccessToken(existingUser.refresh_token)
            let accessToken = JSON.parse(twitchResponse)['access_token']

            var headers = {
                'client-id': process.env.TWITCH_CLIENT_ID,
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            };
            
            var dataString = JSON.stringify(req.body.data);
            
            var options = {
                url: `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${existingUser.twitch_ID}`,
                method: 'POST',
                headers: headers,
                body: dataString
            };

            request(options, (error, response)=>{
                if (!error) {
                    res.json({response})
                } else {
                console.log(error)
                }
            })

        } else {
            console.log('createCustomRewards Api endpoint errored out when getting user from db')
        }
    })
})

router.post('/deleteCustomReward', jsonParser, (req, res)=>{

    User.findOne({ login_username: req.body.channel }).then(async (existingUser)=>{
        if(existingUser){
            let twitchResponse = await generateNewAccessToken(existingUser.refresh_token)
            let accessToken = JSON.parse(twitchResponse)['access_token']
            
            var headers = {
                'Client-Id': process.env.TWITCH_CLIENT_ID,
                'Authorization': 'Bearer ' + accessToken
            };
            
            var options = {
                url: `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${existingUser.twitch_ID}&id=${req.body.id}`,
                method: 'DELETE',
                headers: headers
            };

            request(options, (error, response)=>{
                if (!error) {
                    res.json({response})
                } else {
                    console.log(error)
                }
            });

        } else {
            console.log('deleteCustomReward Api endpoint errored out when getting user from db')
        }
    })
    
})

router.get('/getCustomReward/:channel/:manageable', (req, res)=>{

    User.findOne({ login_username: req.params.channel }).then(async (existingUser)=>{
        if(existingUser){
            let twitchResponse = await generateNewAccessToken(existingUser.refresh_token)
            let accessToken = JSON.parse(twitchResponse)['access_token']

            var headers = {
                'Client-Id': process.env.TWITCH_CLIENT_ID,
                'Authorization': 'Bearer ' + accessToken
            };
             
            var options = {
                url: `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${existingUser.twitch_ID}&only_manageable_rewards=${req.params.manageable}`,
                headers: headers
            };

            // gets all custom rewards
            request(options, (error, response)=>{   
                res.json(JSON.parse(response.body))
            })

        } else {
                    console.log('getCustomReward Api endpoint errored out when getting user from db')
        }
    })
})

router.post('/updateCustomReward', jsonParser, (req, res)=>{

    User.findOne({ login_username: req.body.channel }).then(async (existingUser)=>{
        if(existingUser){
            let twitchResponse = await generateNewAccessToken(existingUser.refresh_token)
            let accessToken = JSON.parse(twitchResponse)['access_token']

            var headers = {
                'client-id': process.env.TWITCH_CLIENT_ID,
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            };

            var dataString = JSON.stringify(req.body.data.updatedData);
            
            var options = {
                url: `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${existingUser.twitch_ID}&id=${req.body.rewardID}`,
                method: 'PATCH',
                headers: headers,
                body: dataString
            };

            request(options, (error, response)=>{
                if (!error) {
                    res.json({response})
                } else {
                console.log(error)
                }
            })

        } else {
            console.log('updateCustomRewards Api endpoint errored out when getting user from db')
        }
    })
})

// router.get('/getRewardRedemptions/:channel/:rewardID', (req, res) => {
// console.log(req.params)
//     User.findOne({ login_username: req.params.channel }).then(async (existingUser)=>{
//         if(existingUser){
//             let twitchResponse = await generateNewAccessToken(existingUser.refresh_token)
//             let accessToken = JSON.parse(twitchResponse)['access_token']


//         var headers = {
//             'Client-Id': process.env.TWITCH_CLIENT_ID,
//             'Authorization': 'Bearer ' + accessToken
//         };
        
//         var options = {
//             url: `https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?broadcaster_id=${existingUser.twitch_ID}&reward_id=${req.params.rewardID}`,
//             headers: headers
//         };

//         request(options, (error, response)=>{
//             if (!error) {
//                 console.log(JSON.parse(response.body))
//                 res.json({response})
//             } else {
//             console.log(error)
//             }
//         })

//     } else {
//         console.log('getCustomReward Api endpoint errored out when getting user from db')
//     }
//     })
// })

module.exports = router;  