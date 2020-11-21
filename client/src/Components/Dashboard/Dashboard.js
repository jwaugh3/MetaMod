//Files
import React, {Component} from 'react';
import apiCall from '../../functions/apiCall';
//Components
import TwitchChatModule from './TwitchChatModule/TwitchChatModule';
import TwitchChatContent from './TwitchChatModule/TwitchChatContent/TwitchChatContent';
import ModChatModule from './ModChatModule/ModChatModule';
import ModChatContent from './ModChatModule/ModChatContent/ModChatContent';
//Styles
import styles from './Dashboard.module.css';
//Assets
//Resources
import socket from '../../socket';


class Dashboard extends Component {

  state = {
    currentChannel: '',
    modChatEnabled: true,
    twitchChatCount: 1,
    modMsg: '',
    modMsgs: [],
    twitchMessages: [],
    moduleSettings: [ { moduleName: '', settingsDisplay: false, editModuleName: false, paused: false, commands: true, nonsubscribers: true, subscribers: true, directChat: true, emotes: true, modMsgs: true } ],
    channelEmotes: [],
    channelEmoteCodes: [],
    channelEmoteIDByName: []
  }

  componentDidMount = async () => {

    if(this.state.currentChannel !== this.props.currentChannel){
      //setup to handle mod msgs
      if(!this.props.channelHistory.length > 0){
        console.log('test')
        socket.on('newModMsg', (modMsg)=>{
          this.setState({modMsgs: [...this.state.modMsgs, modMsg]})
        })
      }

      //reset messages
      this.setState({twitchMessages: [], modMsgs: [], currentChannel: this.props.currentChannel})
        
      socket.on(this.props.currentChannel, (messageData)=>{
        if(this.state.twitchMessages.length < 200){
            this.setState({twitchMessages: [...this.state.twitchMessages, messageData]})
        } else {
            this.setState({twitchMessages: [...this.state.twitchMessages.slice(1), messageData]})
        }
      })
     
      //get channels emotes
      apiCall.getEmotes(this.props.apiEndpoint, this.props.currentChannel)
        .then((channelEmotes)=>{
          this.setState({channelEmotes: channelEmotes[0], channelEmoteCodes: channelEmotes[1], channelEmoteIDByName: channelEmotes[2]})
        })
    }

  }

  addTwitchChatModule = () => {
    if(this.state.twitchChatCount <= 3){
      this.setState({
        twitchChatCount: this.state.twitchChatCount +1, 
        moduleSettings: [...this.state.moduleSettings,  { moduleName: '', settingsDisplay: false, editModuleName: false, paused: false, commands: true, nonsubscribers: true, subscribers: true, directChat: true, emotes: true, modMsgs: true } ]})
    }
  }

  toggleModChatModule = () => {
    this.setState({ modChatEnabled: !this.state.modChatEnabled })
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

  updateSettings = (setting, moduleNum) => {
    if(setting === 'Commands'){
      let newObject = [...this.state.moduleSettings]
      newObject[moduleNum].commands = !this.state.moduleSettings[moduleNum].commands
      this.setState({moduleSettings: newObject})
    }
    else if(setting === 'Subscriber Messages'){
      let newObject = [...this.state.moduleSettings]
      newObject[moduleNum].subscribers = !this.state.moduleSettings[moduleNum].subscribers
      this.setState({moduleSettings: newObject})
    }
    else if(setting === 'NonSubscriber Messages'){
      let newObject = [...this.state.moduleSettings]
      newObject[moduleNum].nonsubscribers = !this.state.moduleSettings[moduleNum].nonsubscribers
      this.setState({moduleSettings: newObject})
    }
    else if(setting === '@' + this.state.currentChannel){
      let newObject = [...this.state.moduleSettings]
      newObject[moduleNum].directChat = !this.state.moduleSettings[moduleNum].directChat
      this.setState({moduleSettings: newObject})
    }
    else if(setting === 'Emotes'){
      let newObject = [...this.state.moduleSettings]
      newObject[moduleNum].emotes = !this.state.moduleSettings[moduleNum].emotes
      this.setState({moduleSettings: newObject})
    }
    else if(setting === 'modMsgs'){
      let newObject = [...this.state.moduleSettings]
      newObject[moduleNum].modMsgs = !this.state.moduleSettings[moduleNum].modMsgs
      this.setState({moduleSettings: newObject})
    }
  }

  settingsToggle = (moduleNum) => {
    let settings = [...this.state.moduleSettings]
    settings[moduleNum].settingsDisplay = !this.state.moduleSettings[moduleNum].settingsDisplay
    this.setState({moduleSettings: settings})
  }

  removeChatModule = (moduleNum) => {
    let moduleSettings = [...this.state.moduleSettings]
    moduleSettings.splice(moduleNum, 1)
    // console.log(moduleSettings)
    this.setState({twitchChatCount: this.state.twitchChatCount -1, moduleSettings: moduleSettings})
  }

  chatNameHandler = (moduleNum, event) => {
    let updatedSettings = [...this.state.moduleSettings]
    updatedSettings[moduleNum].moduleName = event.target.value
    this.setState({moduleSettings: updatedSettings})
  }

  editNameToggler = (moduleNum) => {
    let updatedNameSettings = [...this.state.moduleSettings]
    updatedNameSettings[moduleNum].editModuleName = !this.state.moduleSettings[moduleNum].editModuleName
    this.setState({moduleSettings: updatedNameSettings})
  }

  pauseStateChatModule = (moduleNum) => {
    // console.log(this.state.twitchMessages)
    let updatedPausedState = [...this.state.moduleSettings]
    updatedPausedState[moduleNum].paused = !this.state.moduleSettings[moduleNum].paused
    this.setState({moduleSettings: updatedPausedState})
  }



    render() {

        let chatModules = []

        for(let i=0; i < this.state.twitchChatCount; i++){
          chatModules.push(
            <TwitchChatModule 
              className={styles.twitchModule} 
              key={this.props.twitchChatCount-i} 
              id="twitchModule" 
              moduleSettings={this.state.moduleSettings[i]} 
              moduleNum={i} 
              twitchMessages={this.state.twitchMessages}
              updateSettings={this.updateSettings}
              removeChatModule={this.removeChatModule}
              settingsToggle={this.settingsToggle}
              chatNameHandler={this.chatNameHandler}
              editNameToggler={this.editNameToggler}
              pauseStateChatModule={this.pauseStateChatModule}
              currentChannel={this.state.currentChannel}
            >
            <TwitchChatContent 
              twitchMessages={this.state.twitchMessages}
              draggable="true" 
              moduleSettings={this.state.moduleSettings[i]} 
              moduleNum={i}
              currentChannel={this.state.currentChannel}
              emotes={this.state.channelEmotes}
              emoteCodes={this.state.channelEmoteCodes}
              emoteIDByName={this.state.channelEmoteIDByName}
              username={this.props.username}
            />
            </TwitchChatModule>
          )
        }

        return ( 
            <div className={styles.chatModules}>
            <ModChatModule 
                className={styles.modModule} 
                visibility={this.state.modChatEnabled} 
                roomUsers={this.props.roomUsers}
                onMessageSubmit={this.onMessageSubmit} 
                inputChangedHandler={this.inputChangedHandler}
                transferTwitchMsg={this.transferTwitchMsg}
                id="modModule"
            >
                <ModChatContent 
                    modMsgs={this.state.modMsgs} 
                    username={this.props.username}
                    profileImage={this.props.profileImage}
                    currentChannel={this.props.currentChannel}
                    id="modCard"
                    draggable="true"
                >
                </ModChatContent>
            </ModChatModule>
            {chatModules}
        </div>
        );
    }
}
    
export default Dashboard;