//Files
import React, {Component} from 'react';
//Styles
import styles from './ModChatContent.module.css';
//Assets


class ModChatContent extends Component {

    render() {

        let chatContent = this.props.modMsgs.map((msgObject)=>{
            
            if(msgObject.sentBy === this.props.username && msgObject.username === this.props.username){
                return( //message sent by the user themselves - done
                    <div className={styles.modMsg}
                    key={this.props.modMsgs.indexOf(msgObject)} 
                    draggable="false"
                    >
                        <div className={styles.userContainer}>
                            <img className={styles.msgImg} src={this.props.profileImage} alt="Mod"/>
                            <p className={styles.modUsername}>{msgObject.username}</p>
                        </div>
                        <div className={styles.msgText}  style={{backgroundColor: '#2C2E33'}}>
                            {msgObject.modMsg}
                        </div>
                    </div>
                )
            }
            if(msgObject.sentBy !== this.props.username && msgObject.userType === 'mod'){
                return( //message sent by another mod - done
                    <div className={styles.modMsg}
                    key={this.props.modMsgs.indexOf(msgObject)} 
                    draggable="false"
                    >
                        <div className={styles.userContainer}>
                            <img className={styles.msgImg} src={msgObject.profileImage} alt="Mod"/>
                            <p className={styles.modUsername}>{msgObject.username}</p>
                        </div>
                        <div className={styles.msgText}  style={{backgroundColor: '#2C2E33'}}>
                            {msgObject.modMsg}
                        </div>
                    </div>
                )
            }
            else if(msgObject.userType === 'twitchUser'){

                let insertDiv = <div dangerouslySetInnerHTML={{__html: msgObject.modMsg}}></div>

                return( //message moved from twitch chat by user - done
                    <div className={styles.modMsg}
                    key={this.props.modMsgs.indexOf(msgObject)} 
                    draggable="false"
                    >
                        <div className={styles.userContainer}>
                            <img className={styles.msgImg} src={msgObject.profileImage} alt="Mod"/>
                            <p className={styles.modUsername}>{msgObject.sentBy}</p>
                        </div>
                        <div className={styles.embeddedMsg}>
                            
                            <div className={styles.twitchMsgText}>
                                {insertDiv}
                            </div>
                        </div>
                    </div>
                )
            }
            else if(msgObject.sentBy === 'server'){
                return( //join/leave messages
                    <div className={styles.serverMsgContainer}
                        key={this.props.modMsgs.indexOf(msgObject)} 
                    >
                        <div className={styles.horzLine}></div>
                            <p className={styles.serverText}>
                                {msgObject.username === this.props.username ? 'You have ' : `${msgObject.username} has`} 
                                {msgObject.userType === 'serverJoin' ? ` joined ${this.props.currentChannel}'s mod chat` : ` left mod chat`}
                                </p>
                        <div className={styles.horzLine}></div>
                    </div>
                )
            }
        })

        return ( 
            <div>
                {chatContent}
                <div id={"lastModCard"+this.props.moduleNum}></div>
            </div>
        );
    }
}
    
export default ModChatContent;