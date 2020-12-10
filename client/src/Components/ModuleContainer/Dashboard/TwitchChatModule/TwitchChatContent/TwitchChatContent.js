//Files
import React, {Component} from 'react';
import emoteHandler from './logicHandlers/emoteHandler';
import chatFilter from './logicHandlers/chatFilter';
//Components
//Styles
import styles from './TwitchChatContent.module.css';
//Assets
//State Management
import { connect } from 'react-redux';


class TwitchChatContent extends Component {

    dragStart = (event) => {
        const target = event.target
        event.dataTransfer.setData('transfer', target.id)
    }

    dragOver = (event) => {
        event.stopPropagation();
    }

    render() {

        let chatContent = this.props.twitchMessages.map((msgObject)=>{

            if((new RegExp(this.props.emoteCodes.join('|'), 'gi')).test(msgObject.msg) || msgObject.emotes !== null){
                msgObject.msg = emoteHandler(msgObject, this.props)
            }
            
            if(msgObject.displayName === this.props.username) {
                msgObject.displayColor = "#FF5E64"
            } else if(msgObject.mod === true){
                msgObject.displayColor = "#00FF7F"
            } else if(msgObject.subscriber === true){
                msgObject.displayColor = "#8B35D8"
            } else if(msgObject.subscriber === false){
                msgObject.displayColor = "#05A1E5"
            } 

            let shouldDisplay = chatFilter(msgObject, this.props.moduleNum, this.props)

            if(shouldDisplay === true){
                return(
                    <div className={styles.msgText} 
                        id={'twitchCard' + this.props.twitchMessages.indexOf(msgObject)}
                        key={this.props.twitchMessages.indexOf(msgObject)}
                        draggable={this.props.draggable}
                        onDragStart={this.dragStart}
                        onDragOver={this.dragOver}
                        >
                        <div className={styles.usernameContainer}
                        style={{backgroundColor: `${msgObject.displayColor}`}}
                        >
                            <p className={styles.usernameText}>{msgObject.displayName}</p>
                        </div>
                        : {msgObject.msg}
                    </div>
                )
            }
            else {
                return null
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

const mapStateToProps = (state) => {
    return {
        username: state.applicationReducer.username,
        moduleSettings: state.twitchChatReducer.moduleSettings,
        twitchMessages: state.twitchChatReducer.twitchMessages,
        emotes: state.twitchChatReducer.channelEmotes, 
        emoteCodes: state.twitchChatReducer.channelEmoteCodes,
        emoteIDByName: state.twitchChatReducer.channelEmoteIDByName
    }
}
    
export default connect(mapStateToProps, null)(TwitchChatContent);