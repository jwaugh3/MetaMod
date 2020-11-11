//Files
import React, {Component} from 'react';
import emoteHandler from './logicHandlers/emoteHandler';
import chatFilter from './logicHandlers/chatFilter';
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

        let chatContent = this.props.twitchMessages.map((msgObject)=>{

            if((new RegExp(this.props.emoteCodes.join('|'), 'gi')).test(msgObject.msg) || msgObject.emotes !== null){
                msgObject.msg = emoteHandler(msgObject, this.props)
            }

            let shouldDisplay = chatFilter(msgObject, this.props)

            if(shouldDisplay === true){
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
            else {
                return
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