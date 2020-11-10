//Files
import React, {Component} from 'react';
//Components
//Styles
import styles from './TwitchChatContent.module.css';
//Assets


class TwitchChatContent extends Component {

    dragStart = (event) => {
        const target = event.target
        event.dataTransfer.setData('transfer', target.id)
    }

    dragOver = (event) => {
        event.stopPropagation();
    }

    render() {
// moduleSettings : { moduleName: '', settingsDisplay: false, editModuleName: false, paused: false, hideCommands: false, subscribersOnly: false }

        let chatContent = this.props.twitchMessages.map((msgObject)=>{
            console.log(msgObject.msg)
            if(this.props.moduleSettings.hideCommands && msgObject.msg.substring(0,1).includes('!')){
               return
            } 
            else if(this.props.moduleSettings.subscribersOnly && !msgObject.subscriber){
                return
            }
            else if((new RegExp(this.props.emoteCodes.join('|'), 'gi')).test(msgObject.msg) || msgObject.emotes !== null){
                
                var emoteID = this.props.emoteIDByName
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


                if((new RegExp(this.props.emoteCodes.join('|'), 'gi')).test(msgObject.msg)){
                    this.props.emotes.forEach(emote => {
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
                console.log('splitCode', splitCode)

                return(
                    <div className={styles.msgText} 
                        id={'twitchCard' + this.props.twitchMessages.indexOf(msgObject)}
                        key={this.props.twitchMessages.indexOf(msgObject)}
                        draggable={this.props.draggable}
                        onDragStart={this.dragStart}
                        onDragOver={this.dragOver}
                        >
                        <p style={{color: `${msgObject.displayColor}`, display: 'inline-block', margin: '2px', userSelect: 'none'}}>{msgObject.displayName}</p>
                           : {splitCode}
                    </div>
                )
            }
            else {
                return(
                    <div className={styles.msgText} 
                        id={'twitchCard' + this.props.twitchMessages.indexOf(msgObject)}
                        key={this.props.twitchMessages.indexOf(msgObject)}
                        draggable={this.props.draggable}
                        onDragStart={this.dragStart}
                        onDragOver={this.dragOver}
                        >
                        <p style={{color: `${msgObject.displayColor}`, display: 'inline-block', margin: '2px'}}>{msgObject.displayName}</p>
                        : {msgObject.msg}
                    </div>
                )
            }
        })

        return ( 
            <div>
                {chatContent}
                <div id={"lastCard"+this.props.moduleNum}></div>
            </div>
        );
    }
}
    
export default TwitchChatContent;