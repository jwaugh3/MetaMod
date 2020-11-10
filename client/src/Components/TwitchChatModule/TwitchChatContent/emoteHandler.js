import React, {Component} from 'react';
import styles from './TwitchChatContent.module.css';

const emoteHandler = (msgObject, props) => {
    var emoteID = props.emoteIDByName
    let splitCode = [msgObject.msg]
    var loopCount = 0

    if(msgObject.emotes !== null){
        for(const key in msgObject.emotes){
            splitCode.forEach((part)=>{
                let index = splitCode.indexOf(part)

                msgObject.emotes[key].forEach((indexArray)=>{
                    console.log(indexArray)

                    let stringIndex = indexArray.split('-')
                    
                    console.log('part', part)
                    if(typeof part === 'string'){
                        let emoteString = part.substring(stringIndex[0], stringIndex[1]+1)
                        console.log('emoteString', emoteString)
                        part = part.split(emoteString)

                        if(part.length > 1){
                            let i = 1
                            let emoteTag
                
                            while (i < part.length) {
                                emoteTag = <img src={`https://static-cdn.jtvnw.net/emoticons/v1/${key}/1.0`} key={key+''+loopCount}/>
                                console.log(key)

                                part.splice(i, 0, emoteTag);
                                i += 2;
                                loopCount++
                            }
                        }
                    } else {
                        part = [part]
                    }
                })
            
                splitCode.splice(index, 1, ...part)
            })
        }
    }


    if((new RegExp(props.emoteCodes.join('|'), 'gi')).test(msgObject.msg)){
        props.emotes.forEach(emote => {
            splitCode.forEach((part)=>{
                
                // console.log(loopCount)
                let index = splitCode.indexOf(part)

                if(typeof part === 'string'){
                    part = part.split(emote.code)

                    
                    if(part.length > 1){
                        
                        let emoteTag
                        let i = 1
            
                        while (i < part.length) {
                            if(emote.origin === 'bttv'){ 
                                emoteTag = <img src={`https://cdn.betterttv.net/emote/${emoteID[emote.code]}/1x`} key={emote.code+''+loopCount} className={styles.emote} draggable="false"/>
                            }
                            else{
                                emoteTag = <img src={`https://cdn.frankerfacez.com/emoticon/${emoteID[emote.code]}/1`} key={emote.code+''+loopCount} className={styles.emote} draggable="false"/>
                            }

                            part.splice(i, 0, emoteTag);
                            i += 2;
                            loopCount++
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