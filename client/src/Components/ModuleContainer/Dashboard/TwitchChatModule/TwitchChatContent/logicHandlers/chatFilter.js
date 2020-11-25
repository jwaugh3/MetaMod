const chatFilter = (msgObject, moduleNum, props) => {
    let moduleSettings = props.moduleSettings[moduleNum]
    let msg = msgObject.msg
    // var shouldDisplay = true
    //handles command display
    if(typeof msg === 'string' && !moduleSettings.commands && msg.substring(0,1).includes('!')){ 
        return false
     }

    //handles emote display
    if(!moduleSettings.emotes && Array.isArray(msg)){ 
        let containsEmoteObj = msg.some((value) => {//check for emotes - returns boolean
            return typeof value == 'object'
        })
        if(containsEmoteObj){
            return false
        }
    }

    //handle @streamer display
    if(!moduleSettings.directChat){
        if(Array.isArray(msg)){ //handles direct messages with emotes
            msgObject.msg.forEach(el => {
                if(typeof el === 'string' && el.toLowerCase().includes('@'+props.currentChannel)){
                    return false
                }
            })
        }
        else if(msg.toLowerCase().includes('@'+props.currentChannel)){ //handles direct messages without emotes
            return false
        }
    }

    //handles mod messages
    if(!moduleSettings.modMsgs && msgObject.mod){
        return false
    }

    //handles subscriber messages
    if(!moduleSettings.subscribers && msgObject.subscriber){
        return false
    }

    //handles nonsubscriber messages
    if(!moduleSettings.nonsubscribers && !msgObject.subscriber){
        return false
    }



    return true
}

export default chatFilter;