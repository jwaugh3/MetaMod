const request = require('request');
const lodash = require('lodash');
const { FfzEmote } = require('../../models/dbModels');

const getFfzChannelEmotes = (channelID, channelName) => {
    let baseURL = 'https://api.frankerfacez.com/v1/room/id/'

    var options = {
    'url': baseURL + channelID
    };

    request(options, (err, result, body)=>{
        console.log(JSON.parse(body).error)
        if(JSON.parse(body).error){
            console.log(body.message)
        } else {
            console.log(body)
            let emoteData = JSON.parse(body)
            let set = emoteData.room.set
            let channelEmotes = []

            emoteData.sets[set].emoticons.forEach((emoteObject)=>{
                let urlArray = emoteObject.urls['1'].split('.')
                let id = emoteObject.id.toString()
                
                let emote = {
                    origin: 'ffz',
                    emote_ID: id, 
                    code: emoteObject.name
                }
                channelEmotes.push(emote)
            })

            new FfzEmote({
                origin: 'ffz',
                channel_ID: channelID,
                channel_name: channelName,
                emotes: channelEmotes
            })
            .save()
        }
    })
}

const updateFfzChannelEmotes = (channelID, channelName) => {
    let baseURL = 'https://api.frankerfacez.com/v1/room/id/'

    var options = {
    'url': baseURL + channelID
    };
    
    request(options, (err, result, body)=>{
        let emoteData = JSON.parse(body)
        if(emoteData.message){
            console.log(emoteData.message)
        } else {
            let set = emoteData.room.set
            let channelEmotes = []

            emoteData.sets[set].emoticons.forEach((emoteObject)=>{
                let urlArray = emoteObject.urls['1'].split('.')
                let id = emoteObject.id.toString()
                
                let emote = {
                    origin: 'ffz',
                    emote_ID: id, 
                    code: emoteObject.name
                }
                channelEmotes.push(emote)
            })
            // console.log(channelEmotes)
    
            FfzEmote.findOne({channel_ID: channelID}).then((response)=>{
                if(response === null){
                    new FfzEmote({
                        origin: 'ffz',
                        channel_ID: channelID,
                        channel_name: channelName,
                        emotes: channelEmotes
                    })
                    .save()
                } else {
                    let dbVersion = response.emotes.sort((a, b)=> (a.code > b.code) ? 1 : -1)
                    let apiVersion = channelEmotes.sort((a, b)=> (a.code > b.code) ? 1 : -1)
                    let emoteEqual = lodash.isEqual(dbVersion, apiVersion)
    
                    if(!emoteEqual){
                        FfzEmote.findOneAndUpdate({channel_ID: channelID}, {emotes: apiVersion}, {new: true, useFindAndModify: false}).then((data)=>{
                            console.log(data)
                        })
                    }
                }
            })
        }
    })
}

const updateFfzGlobalEmotes = () => {
    let baseURL = 'https://api.frankerfacez.com/v1/set/global'

    var options = {
    'url': baseURL
    };
    
    request(options, (err, result, body)=>{
        let emoteData = JSON.parse(body)
        console.log(emoteData)
        let set = emoteData['default_sets']

        if(emoteData.message){
            console.log(emoteData.message)
        } else {
            let channelEmotes = []

            emoteData.sets[set].emoticons.forEach((emoteObject)=>{
                let urlArray = emoteObject.urls['1'].split('.')
                let id = emoteObject.id.toString()
                
                let emote = {
                    origin: 'ffz',
                    emote_ID: id, 
                    code: emoteObject.name
                }
                channelEmotes.push(emote)
            })
            console.log(channelEmotes)

            // FfzEmote.findOne({channel_ID: 'global'}).then((response)=>{
            //     let dbVersion = response.emotes.sort((a, b)=> (a.code > b.code) ? 1 : -1)
            //     let apiVersion = channelEmotes.sort((a, b)=> (a.code > b.code) ? 1 : -1)
            //     let emoteEqual = lodash.isEqual(dbVersion, apiVersion)
    
            //     if(!emoteEqual){
            //         FfzEmote.findOneAndUpdate({channel_ID: 'global'}, {emotes: apiVersion}, {new: true, useFindAndModify: false})
            //     }
            // })
        }
    })
}

module.exports = {
    getFfzChannelEmotes,
    updateFfzChannelEmotes,
    updateFfzGlobalEmotes
}