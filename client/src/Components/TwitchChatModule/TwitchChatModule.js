import React, {Component} from 'react';
//Components
import Settings from '../TwitchChatModule/Settings/Settings';
//Styles
import styles from './TwitchChatModule.module.css';
//Assets
import settingsIcon from '../../resources/setting-icon.png';
import editIcon from '../../resources/editIcon.png';

class TwitchChatModule extends Component {

    scrollToBottom = () => { 
        let lastCard = document.getElementById('lastCard'+this.props.moduleNum)
        lastCard.scrollIntoView()
        if(this.props.moduleSettings.paused === true){
            //if resume button is clicked then changed paused state to false
            this.props.pauseStateChatModule(this.props.moduleNum)
        }
    }

    componentDidMount(){
        if(this.props.twitchMessages.length > 0){
            document.getElementById('chatContainer').addEventListener(
                'scroll',
                () => {
                    var scrollTop = document.getElementById('chatContainer').scrollTop;
                    var scrollHeight = document.getElementById('chatContainer').scrollHeight;
                    var offsetHeight = document.getElementById('chatContainer').offsetHeight;
                    var contentHeight = scrollHeight - offsetHeight;
                    if (contentHeight <= scrollTop && this.props.moduleSettings.paused === true) // checks if chatContainer is scrolled to bottom && setting is paused
                    {
                        this.props.pauseStateChatModule(this.props.moduleNum)
                        this.scrollToBottom()
                    }
                },
                false
            )
        }
    }

    componentDidUpdate(){
        if(this.props.twitchMessages.length > 0){
            let chatViewport = document.getElementById('chatContainer').getBoundingClientRect()
            let bottomChatViewport = chatViewport.y + chatViewport.height
            let lastChat = document.getElementById("lastCard" + this.props.moduleNum).getBoundingClientRect()
            let bottomLastChat = lastChat.y + lastChat.height
            if(bottomLastChat-250 < bottomChatViewport){
                this.scrollToBottom()
            } else if(this.props.moduleSettings.paused !== true) {
                this.props.pauseStateChatModule(this.props.moduleNum)
            }
        }
    }

    render() {

        return ( 
            <div className={styles.mainContainer}>
                <div className={styles.headerContainer}draggable='false'>
                    <h3 className={styles.chatHeader}>Twitch Chat -</h3>
                    {this.props.moduleSettings.editModuleName ? 
                        <div className={styles.customHeaderContainer}>
                            <input 
                                type="text" 
                                maxLength="18"
                                className={styles.chatNameInput}
                                onSubmit={()=>this.props.editNameToggler(this.props.moduleNum)}
                                onChange={(event)=>this.props.chatNameHandler(this.props.moduleNum, event)} 
                                value={this.props.moduleSettings.moduleName}
                            />
                            <button className={styles.editButton} style={{marginBottom: '0px'}} onClick={()=>this.props.editNameToggler(this.props.moduleNum)}><img src={editIcon} className={styles.editIcon} alt="Edit Name"></img></button>
                        </div>
                        : 
                        <div className={styles.customHeaderContainer}>
                            <h3 className={styles.customHeader}>{this.props.moduleSettings.moduleName}</h3>
                            <button className={styles.editButton} onClick={()=>this.props.editNameToggler(this.props.moduleNum)}><img src={editIcon} className={styles.editIcon} alt="Edit Name"></img></button>
                        </div>
                    }
                </div>
                <div className={styles.chatContainer} id='chatContainer' style={this.props.moduleSettings.settingsDisplay ? {height: '44vh'} : {height: '89vh'}}>
                    {this.props.children}
                </div>
                {this.props.moduleSettings.paused ?
                        <div className={styles.resumeButtonContainer}>
                                <button className={styles.resumeButton} onClick={this.scrollToBottom}>Resume Chat</button>
                        </div>
                        :
                        <div/>
                    }
                <div className={styles.inputContainer} draggable='false'>
                    <div className={styles.buttonContainer} draggable='false'>
                        <div className={styles.settingsButton} onClick={()=>this.props.settingsToggle(this.props.moduleNum)}><img src={settingsIcon} className={styles.settingsIcon} draggable='false' alt="Toggle Settings"/></div>
                    </div>
                </div>
                <Settings 
                    display={this.props.moduleSettings.settingsDisplay} 
                    moduleSettings={this.props.moduleSettings} 
                    moduleNum={this.props.moduleNum} 
                    updateSettings={this.props.updateSettings} 
                    removeChatModule={this.props.removeChatModule}
                    channel={this.props.currentChannel}
                />
            </div>
        );
    }
}
    
export default TwitchChatModule;