import { split } from 'lodash';
import React from 'react';
import styles from '../TwitchChatContent.module.css';

const emoteHandler = (msgObject, props) => {
    var emoteID = props.emoteIDByName
    var splitCode = msgObject.msg
    var loopCount = 0
    var stringExtend = 0
    let emoteArray = []
    let emoteTag

    for(const key in msgObject.emotes){
        msgObject.emotes[key].forEach((location)=>{
            emoteArray.push([key, parseInt(location.split('-')[0]), location])
        })
    }
    emoteArray.sort((a, b)=> {return (a[1] < b[1]) ? -1 : 1})
    console.log(emoteArray)

    if(typeof msgObject.msg === 'string'){

        emoteArray.forEach((emoteData)=>{

            let part = splitCode

            let stringIndex = emoteData[2].split('-')

            part = part.substr(0, parseInt(stringIndex[0])+stringExtend) + '#' + emoteData[0] + part.substr(parseInt(stringIndex[1])+1+stringExtend)

            stringExtend = stringExtend + parseInt(emoteData[0].length+1) - (parseInt(stringIndex[1])-parseInt(stringIndex[0]) +1)


            splitCode = part
        })

        splitCode = [splitCode]  

        emoteArray.forEach((emoteData)=>{
            let newKey = emoteData[0] + emoteData[1]
            console.log(newKey)
            splitCode.forEach((part)=>{
                let index = splitCode.indexOf(part)
                if(typeof part === 'string'){
                    part = part.split('#' + emoteData[0])
                    
                    if(part.length > 1){

                        emoteTag = <img src={`https://static-cdn.jtvnw.net/emoticons/v1/${emoteData[0]}/1.0`} key={newKey} className={styles.emote} draggable="false" alt="Twitch Emote"/>

                        part.splice(1, 0, emoteTag)
                    }

                } else {
                    part = [part]
                }
                
                splitCode.splice(index, 1, ...part)
            })
        })
        
        console.log('splitCode', splitCode)            
    }
console.log(msgObject.msg)

    if((new RegExp(props.emoteCodes.join('|'), 'gi')).test(msgObject.msg)){
        
        if(!Array.isArray(splitCode)){
            splitCode = [splitCode]  
        }

        props.emotes.forEach(emote => {
            splitCode.forEach((part)=>{
                
                
                let index = splitCode.indexOf(part)

                if(typeof part === 'string'){
                    part = part.split(emote.code)

                    
                    if(part.length > 1){
                        
                        let i = 1
            
                        while (i < part.length) {
                            if(emote.origin === 'bttv'){ 
                                emoteTag = <img src={`https://cdn.betterttv.net/emote/${emoteID[emote.code]}/1x`} key={emote.code+''+loopCount} className={styles.emote} draggable="false" alt="Emote"/>
                            }
                            else{
                                emoteTag = <img src={`https://cdn.frankerfacez.com/emoticon/${emoteID[emote.code]}/1`} key={emote.code+''+loopCount} className={styles.emote} draggable="false" alt="Emote"/>
                            }

                            part.splice(i, 0, emoteTag);
                            i += 2;
                            loopCount = loopCount + 1
                        }

                    }
                } else {
                    part = [part]
                }

                splitCode.splice(index, 1, ...part)
            })
        })
    }

   return splitCode
}

export default emoteHandler;