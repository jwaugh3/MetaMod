//Files
import React, {Component} from 'react';
//Components
import TwitchChatModule from './TwitchChatModule/TwitchChatModule';
import TwitchChatContent from './TwitchChatModule/TwitchChatContent/TwitchChatContent';
import ModChatModule from './ModChatModule/ModChatModule';
import ModChatContent from './ModChatModule/ModChatContent/ModChatContent';
import TopNav from '../TopNav/TopNav';
import Auxiliary from '../../../hoc/Auxiliary';
//Styles
import styles from './Dashboard.module.scss';
//Assets
import modIcon from '../../../resources/modIcon.png';
//Resources
import socket from '../../../socket';
//State Management
import { connect } from 'react-redux';

class Dashboard extends Component {

  state = {
    modMsg: ''
  }

  addTwitchChatModule = () => {
    if(this.state.twitchChatCount <= 3){
      this.props.addTwitchModuleSettings()
    }
  }

  inputChangedHandler = (event) => {
    event.preventDefault();
    this.setState({modMsg: event.target.value});
  }

  onMessageSubmit = (event) => {
    event.preventDefault();
    
    if(this.state.modMsg.length > 0){
        document.getElementById('modTextInput').reset()
        socket.emit('modMsg', {
          username: this.props.username, 
          time: 'three', 
          userType: 'mod', 
          modMsg: this.state.modMsg, 
          sentBy: this.props.username,
          profileImage: this.props.profileImage
        })
        this.setState({modMsg: ''})
    }
  }

  transferTwitchMsg = (msg) =>{
    socket.emit('modMsg', { username: '', time: '', userType: 'twitchUser', modMsg: msg, sentBy: this.props.username, profileImage: this.props.profileImage })
  }

    render() {

        let chatModules = []

        for(let i=0; i < this.props.twitchChatCount; i++){
          chatModules.push(
            <TwitchChatModule className={styles.twitchModule} key={this.props.twitchChatCount-i} id="twitchModule" moduleNum={i} >
              <TwitchChatContent draggable="true" moduleNum={i}/>
            </TwitchChatModule>
          )
        }

        return ( 
          <Auxiliary>
            {/* top navigation */}
            <TopNav>
              <div className={styles.buttonSlot}>
                <button onClick={()=>this.props.toggleModChatModule(!this.props.modChatEnabled)} className={styles.navButton} style={this.props.modChatEnabled ? {opacity: '100%'} : {opacity: '50%'}}>
                    <img className={styles.modIcon} src={modIcon} alt="Mod Icon"/>
                </button>
              </div>
              
              <div className={styles.buttonSlot}>
                  <button onClick={()=>{
                      this.props.increaseModuleCount(this.props.twitchChatCount)
                      this.props.addTwitchModuleSettings()
                    }} 
                    className={styles.navButton} id={styles.addButton}>+</button>
              </div>
            </TopNav>

            {/* Modules */}
            <div className={styles.chatModules}>

              <ModChatModule className={styles.modModule} onMessageSubmit={this.onMessageSubmit} inputChangedHandler={this.inputChangedHandler} transferTwitchMsg={this.transferTwitchMsg} id="modModule">
                  <ModChatContent id="modCard" draggable="true"/>
              </ModChatModule>

                {chatModules}
                
            </div>
          </Auxiliary>
        );
    }
}

const mapStateToProps = (state) => {
  return {
    currentChannel: state.applicationReducer.currentChannel,
    username: state.applicationReducer.username,
    profileImage: state.applicationReducer.profileImage,
    modChatEnabled: state.modChatReducer.modChatEnabled,
    twitchChatCount: state.twitchChatReducer.twitchChatCount
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
      toggleModChatModule: (status) => dispatch({type: 'TOGGLE_MOD_CHAT_VIEW', payload: status}),
      addTwitchModuleSettings: () => dispatch({type: 'ADD_TWITCH_CHAT_MODULE'}),
      removeChatModuleFromState: (moduleNum) => dispatch({type: 'REMOVE_CHAT_MODULE', payload: moduleNum}),
      increaseModuleCount: (currentState) => dispatch({type: 'INCREASE_CHAT_MODULE_COUNT', payload: currentState}),
      decreaseModuleCount: (currentState) => dispatch({type: 'DECREASE_CHAT_MODULE_COUNT', payload: currentState})
  }
}
    
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);