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
        return null
    })

    let cleanEmotes = []
    let cleanEmoteCodes = []

    cleanEmoteCodes = channelEmoteCodes.filter((item, pos, self)=>{
        if(self.indexOf(item) === pos){
            cleanEmotes.push(channelEmotes[pos])
            return true
        } else {
            return false
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

const createCustomReward = async (apiURL, channel, customReward) => {
    let rewardData = new Promise((resolve, reject)=>{
        fetch(apiURL + '/api/createCustomRewards/', {
            method: 'POST',
            body: JSON.stringify({
                channel,
                data: customReward
            }),
            headers: {
                'Content-type': 'application/json'
            }
        })
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

    return rewardData
}

const deleteCustomReward = async (apiURL, channel, id) => {

    let rewardData = new Promise((resolve, reject)=>{
        fetch(apiURL + '/api/deleteCustomReward/', {
            method: 'POST',
            body: JSON.stringify({
                channel,
                id,
                data: {
                    
                }
            }),
            headers: {
                'Content-type': 'application/json'
            }
        })
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

    return rewardData
}

const getCustomReward = async (apiURL, channel) => {

    let rewards =[]
    let manageable = [true, false]

    for(let i=0; i < 2; i++){
        
        var check = await new Promise((resolve, reject)=>{
            fetch(apiURL + '/api/getCustomReward/' + channel + '/' + manageable[i])
            .then((data)=>{
                data.json()
                .then((res)=>{
                    rewards.push(res)
                    resolve(res)
                })
            })
            .catch((error)=>{
                reject(error)
                console.log(error)
            })
        })

        if(check.error){
            return 'error'
        }
    }


    if(rewards[0].length !== 0 && rewards[1].length !== 0){
        for(let x=0; x < rewards[0].data.length; x++){
            for(let y=0; y < rewards[1].data.length; y++){
                if(rewards[0].data[x].id === rewards[1].data[y].id){
                    rewards[1].data.splice(y, 1)
                }
            }
        }
    }

    return rewards
}

const updateCustomReward = async (apiURL, channel, rewardID, updatedData) => {

    let rewardData = new Promise((resolve, reject)=>{
        fetch(apiURL + '/api/updateCustomReward', {
            method: 'POST',
            body: JSON.stringify({
                channel,
                rewardID,
                data: {
                    updatedData
                }
            }),
            headers: {
                'Content-type': 'application/json'
            }
        })
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

    return rewardData
}

// const getRewardRedemptions = async (apiURL, channel, rewardID) => {

//     let rewardData = new Promise((resolve, reject)=>{
//         fetch(apiURL + '/api/getRewardRedemptions/' + channel + '/' + rewardID)
//         .then((data)=>{
//             console.log(data)
//             data.json()
//             .then((res)=>{
//                 console.log(JSON.parse(res.response.body))
//                 resolve(res)
//             })
//         })
//         .catch((err)=>{
//             console.log(err)
//         })
//     })

//     return rewardData
// }

module.exports = {
    getUserDetails,
    getMods,
    getEmotes,
    getModRecords,
    createCustomReward,
    deleteCustomReward,
    getCustomReward,
    updateCustomReward,
    // getRewardRedemptions
}
