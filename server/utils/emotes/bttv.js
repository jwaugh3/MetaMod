const request = require('request');
const lodash = require('lodash');
const { BttvEmote } = require('../../models/dbModels');

const getBttvChannelEmotes = (channelID, channelName) => {
    let baseURL = 'https://api.betterttv.net/3/cached/users/twitch/'

    var options = {
    'url': baseURL + channelID
    };

    request(options, (err, result, body)=>{
        let emoteData = JSON.parse(body)
        if(emoteData.message){
            console.log('msg', emoteData.message)
        } else {
            let channelEmotes = []

            emoteData.sharedEmotes.forEach((emoteObject)=>{
                let emote = {
                    origin: 'bttv',
                    emote_ID: emoteObject.id, 
                    code: emoteObject.code
                }
                channelEmotes.push(emote)
            })


            new BttvEmote({
                origin: 'bttv',
                channel_ID: channelID,
                channel_name: channelName,
                emotes: channelEmotes
            })
            .save()
        }
    })
} 

const updateBttvChannelEmotes = (channelID, channelName) => {
    let baseURL = 'https://api.betterttv.net/3/cached/users/twitch/'

    var options = {
    'url': baseURL + channelID
    };
    
    request(options, (err, result, body)=>{
        let emoteData = JSON.parse(body)
        if(emoteData.message){
            console.log(emoteData.message)
        } else {
            let channelEmotes = []
    
            emoteData.sharedEmotes.forEach((emoteObject)=>{
                let emote = {
                    origin: 'bttv',
                    emote_ID: emoteObject.id, 
                    code: emoteObject.code
                }
                channelEmotes.push(emote)
            })
    
            BttvEmote.findOne({channel_ID: channelID}).then((response)=>{
                if(response === null){
                    new BttvEmote({
                        origin: 'bttv',
                        channel_ID: channelID,
                        channel_name: channelName,
                        emotes: channelEmotes
                    })
                    .save()
                } else {
                    let dbVersion = response.emotes.sort((a, b)=> (a.code > b.code) ? 1 : -1)
                    let apiVersion = channelEmotes.sort((a, b)=> (a.code > b.code) ? 1 : -1)
                    let emoteEqual = lodash.isEqual(dbVersion, apiVersion)
                    console.log(apiVersion)
    
                    if(!emoteEqual){
                        BttvEmote.findOneAndUpdate({channel_ID: channelID}, {emotes: apiVersion}, {new: true, useFindAndModify: false}).then((data) => {
                            // console.log(data)
                        })
                    }
                }
            })
        }
    })
}

const updateBttvGlobalEmotes = () => {
    var options = {
        'url': 'https://api.betterttv.net/3/cached/emotes/global'
    };

    request(options, (err, result, body)=>{
        let emoteData = JSON.parse(body)
        let channelEmotes = []

        emoteData.forEach((emoteObject)=>{ 
            let emote = {
                origin: 'bttv',
                emote_ID: emoteObject.id, 
                code: emoteObject.code
            }
            channelEmotes.push(emote)
        })
        
        BttvEmote.findOne({channel_name: 'global'}).then((response)=>{
            let dbVersion = response.emotes.sort((a, b)=> (a.code > b.code) ? 1 : -1)
            let apiVersion = channelEmotes.sort((a, b)=> (a.code > b.code) ? 1 : -1)
            let emoteEqual = lodash.isEqual(dbVersion, apiVersion)

            if(!emoteEqual){
                BttvEmote.findOneAndUpdate({channel_name: 'global'}, {emotes: apiVersion}, {new: true, useFindAndModify: false})
            }
        })
    })
}
 
module.exports = {
    getBttvChannelEmotes,
    updateBttvChannelEmotes,
    updateBttvGlobalEmotes
} 