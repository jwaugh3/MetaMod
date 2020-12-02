const getUserDetails = async (apiURL, twitchID) => {
    let userDetails = new Promise((resolve, reject)=>{
        fetch(apiURL + '/api/userData/' + twitchID)
        .then((data)=>{
            data.json()
            .then((res)=>{
                resolve(res)
            })
        })
        .catch((err)=>{
            console.log(err)
        })
    })

    return userDetails
}

const getMods = async (apiURL, channel) => {
    let mods = new Promise((resolve, reject)=>{
        fetch(apiURL + '/api/getMods/' + channel)
        .then((data)=>{
            data.json()
            .then((res)=>{
                resolve(res)
            })
        })
        .catch((err)=>{
            console.log(err)
        })
    })

    return mods
}

const getEmotes = async (apiURL, channel) => {
    let bttvChannelEmotes = await new Promise((resolve, reject)=>{
        fetch(apiURL + '/api/getBttvEmotes/' + channel)
        .then((data)=>{
            data.json()
            .then((res)=>{
                resolve(res)
            })
        })
        .catch((err)=>{
            console.log(err)
        })
    })

    let ffzChannelEmotes = await new Promise((resolve, reject)=>{
        fetch(apiURL + '/api/getFfzEmotes/' + channel)
        .then((data)=>{
            data.json()
            .then((res)=>{
                resolve(res)
            })
        })
        .catch((err)=>{
            console.log(err)
        })
    })

    //combine all emotes into single array
    let channelEmotes = bttvChannelEmotes.concat(ffzChannelEmotes)

    let channelEmoteCodes =[]

    channelEmotes.map((emote)=>{
        channelEmoteCodes.push(emote.code)
    })

    let cleanEmotes = []
    let cleanEmoteCodes = []

    cleanEmoteCodes = channelEmoteCodes.filter((item, pos, self)=>{
        if(self.indexOf(item) === pos){
            cleanEmotes.push(channelEmotes[pos])
            return true
        }
    })

    let emoteIDByName = {}
    cleanEmotes.forEach((emote)=>{
        emoteIDByName[emote.code] = emote.emote_ID
    })

    return [cleanEmotes, cleanEmoteCodes, emoteIDByName]
}

const getModRecords = async (apiURL, channel) => {

    let modRecords = new Promise((resolve, reject)=>{
        fetch(apiURL + '/api/getModRecords/' + channel)
        .then((data)=>{
            data.json()
            .then((res)=>{
                resolve(res)
            })
        })
        .catch((err)=>{
            console.log(err)
        })
    })
    
    return modRecords
}

export default {
    getUserDetails,
    getMods,
    getEmotes,
    getModRecords
}
