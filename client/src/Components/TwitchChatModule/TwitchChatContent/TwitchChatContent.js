//Files
import React, {Component} from 'react';
import emoteHandler from './emoteHandler';
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
            console.log(msgObject)

            if((new RegExp(this.props.emoteCodes.join('|'), 'gi')).test(msgObject.msg) || msgObject.emotes !== null){
                msgObject.msg = emoteHandler(msgObject, this.props)
            }

            if(this.props.moduleSettings.hideEmotes && Array.isArray(msgObject.msg)){ //handles hide emotes
                let containsEmoteObj = msgObject.msg.some((value) => {
                    return typeof value == 'object'
                })
                if(containsEmoteObj){
                    return
                }
            }
            else if(!this.props.moduleSettings.modMsgs && msgObject.mod){
                return
            }
            else if(typeof msgObject.msg === 'string' && this.props.moduleSettings.hideCommands && msgObject.msg.substring(0,1).includes('!')){ //handles hiding commands
               return
            } 
            else if(this.props.moduleSettings.subscribersOnly && !msgObject.subscriber){ //handles subscriber only chat
                return
            }
            else if(!this.props.moduleSettings.directChat){//handle @streamer messages
                if(Array.isArray(msgObject.msg)){
                    console.log(msgObject.msg)
                    let test = false
                    msgObject.msg.forEach(el => {
                        if(typeof el === 'string' && el.toLowerCase().includes('@'+this.props.currentChannel)){
                            test = true
                        }
                    })
                    console.log('test', test, this.props.currentChannel)
                } else {

                }
            }
            else {//handles all other messages
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