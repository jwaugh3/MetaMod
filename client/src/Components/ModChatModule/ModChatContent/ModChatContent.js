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
                    <div className={styles.myModMsg}
                    key={this.props.modMsgs.indexOf(msgObject)} 
                    style={{textAlign: 'right'}}
                    draggable="false"
                    >
                    <p className={styles.myModUsername}>{msgObject.username}</p>
                    <div className={styles.msgText}  style={{backgroundColor: 'rgb(39, 39, 39)'}}>
                        {msgObject.modMsg}
                    </div>
                </div>
                )
            }
            if(msgObject.sentBy !== this.props.username && msgObject.userType === 'mod'){
                return( //message sent by another mod - done
                    <div className={styles.modMsgContainer}
                        key={this.props.modMsgs.indexOf(msgObject)} 
                        >
                        <p className={styles.modUsername}>{msgObject.username}</p>
                        <div className={styles.modMsgText}>
                          {msgObject.modMsg}
                        </div>
                    </div>
                )
            }
            else if(msgObject.sentBy === this.props.username && msgObject.username !== this.props.username){

                let insertDiv = <div dangerouslySetInnerHTML={{__html: msgObject.modMsg}}></div>


                return( //message moved from twitch chat by user - done
                    <div className={styles.mainContainer} key={this.props.modMsgs.indexOf(msgObject)}>
                        <p className={styles.myModUsername} style={{marginRight: '18px', textAlign: 'right', color: 'white'}}>{this.props.username}</p>
                        <div className={styles.embeddedMsg}>
                            <p className={styles.twitchChatUsername}>{msgObject.username}</p>
                            <div className={styles.twitchMsgText}>
                                {insertDiv}
                            </div>
                        </div>
                    </div>
                )
            }
            else if(msgObject.sentBy !== this.props.username && msgObject.userType === 'twitchUser'){

                let insertDiv = <div dangerouslySetInnerHTML={{__html: msgObject.modMsg}}></div>

                return( //message moved from twitch chat by other mod
                    <div className={styles.mainContainer} key={this.props.modMsgs.indexOf(msgObject)}>
                        <p className={styles.myModUsername} style={{marginLeft: '18px', textAlign: 'left', color: 'white'}}>{msgObject.sentBy}</p>
                        <div className={styles.embeddedMsg}>
                            <p className={styles.twitchChatUsername}>{msgObject.username}</p>
                            <div className={styles.twitchMsgText}>
                                {insertDiv}
                            </div>
                        </div>
                    </div>
                )
            }
            else if(msgObject.sentBy === 'server'){
                return( //message moved from twitch chat by other mod
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
            </div>
        );
    }
}
    
export default ModChatContent;