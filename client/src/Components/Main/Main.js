import React, { Component } from 'react';
import apiCall from '../../functions/apiCall';
import queryString from 'querystring';
//Components
import TwitchChatModule from '../TwitchChatModule/TwitchChatModule';
import ModChatModule from '../ModChatModule/ModChatModule';
import ModChatContent from '../ModChatModule/ModChatContent/ModChatContent';
import TwitchChatContent from '../TwitchChatModule/TwitchChatContent/TwitchChatContent';
//Styles
import styles from './Main.module.css';
//Resources
import modIcon from '../../resources/modIcon.png';
import io from 'socket.io-client';
const socket = io('http://localhost:8888');

class Main extends Component {

  state = {
    modChatEnabled: true,
    twitchChatCount: 1,
    username: '',
    login_username: '',
    twitchID: '',
    profileImage: '',
    modMsg: '',
    modMsgs: [],
    twitchMessages: [],
    moduleSettings: [ { moduleName: '', settingsDisplay: false, editModuleName: false, paused: false, commands: true, nonsubscribers: true, subscribers: true, directChat: true, emotes: true, modMsgs: true } ],
    modList: [],
    currentChannel: '',
    channelAccess: [],
    channelHistory: [],
    roomUsers: [],
    channelEmotes: [],
    channelEmoteCodes: [],
    channelEmoteIDByName: []
  }
  
  componentDidMount = async () => {
    
    //Get query from url
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed['?access_token'];
    let twitchID = parsed['twitch_id']
    
    this.setState({accessToken: accessToken, twitchID: twitchID})

    await apiCall.getUserDetails(twitchID).then((userData)=>{
      console.log(userData)
      this.setState({
        username: userData.username, 
        profileImage: userData.profileImage, 
        login_username: userData.login_username, 
        currentChannel: userData.login_username, 
        channelAccess: userData.channelAccess
      })
    })

    await apiCall.getEmotes(this.state.currentChannel).then((emoteData)=>{
      this.setState({channelEmotes: emoteData[0], channelEmoteCodes: emoteData[1], channelEmoteIDByName: emoteData[2]})
    })

    await apiCall.getMods(this.state.currentChannel).then((data)=>{
      this.setState({modList: data.mods})
    })

    socket.on('roomUsers', (roomUsers)=>{
      console.log(roomUsers)
      let newUsers = roomUsers.users
      this.setState({roomUsers: newUsers})
    })

    this.changeChannel(this.state.currentChannel)


    socket.on('newModMsg', (modMsg)=>{
      console.log(modMsg)
        this.setState({modMsgs: [...this.state.modMsgs, modMsg]})
    })
  }

  addTwitchChatModule = () => {
    if(this.state.twitchChatCount <= 3){
      this.setState({
        twitchChatCount: this.state.twitchChatCount +1, 
        moduleSettings: [...this.state.moduleSettings,  { moduleName: '', settingsDisplay: false, editModuleName: false, paused: false, commands: true, nonsubscribers: true, subscribers: true, directChat: true, emotes: true, modMsgs: true } ]})
    }
  }

  toggleModChatModule = () => {
      this.setState({ modChatEnabled: !this.state.modChatEnabled }, () => {

      })
  }

  inputChangedHandler = (event) => {
    event.preventDefault();
    this.setState({modMsg: event.target.value});
  }

  usernameHandler = (event) => {
    this.setState({username: event.target.value})
  }

  onMessageSubmit = (event) => {
    event.preventDefault();
    
    if(this.state.modMsg.length > 0){
        document.getElementById('modTextInput').reset()
        socket.emit('modMsg', {
          username: this.state.username, 
          time: 'three', 
          userType: 'mod', 
          modMsg: this.state.modMsg, 
          sentBy: this.state.username,
          profileImage: this.state.profileImage
        })
        this.setState({modMsg: ''})
    }
  }

  transferTwitchMsg = (msg) =>{
    socket.emit('modMsg', { username: '', time: '', userType: 'twitchUser', modMsg: msg, sentBy: this.state.username, profileImage: this.state.profileImage })
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
      console.log(newObject)
      this.setState({moduleSettings: newObject})
    }
    else if(setting === 'NonSubscriber Messages'){
      let newObject = [...this.state.moduleSettings]
      newObject[moduleNum].nonsubscribers = !this.state.moduleSettings[moduleNum].nonsubscribers
      console.log(newObject)
      this.setState({moduleSettings: newObject})
    }
    else if(setting === '@' + this.state.currentChannel){
      let newObject = [...this.state.moduleSettings]
      newObject[moduleNum].directChat = !this.state.moduleSettings[moduleNum].directChat
      console.log(newObject)
      this.setState({moduleSettings: newObject})
    }
    else if(setting === 'Emotes'){
      let newObject = [...this.state.moduleSettings]
      newObject[moduleNum].emotes = !this.state.moduleSettings[moduleNum].emotes
      console.log(newObject[moduleNum].emotes)
      this.setState({moduleSettings: newObject})
    }
    else if(setting === 'modMsgs'){
      let newObject = [...this.state.moduleSettings]
      newObject[moduleNum].modMsgs = !this.state.moduleSettings[moduleNum].modMsgs
      console.log(newObject[moduleNum].modMsgs)
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
    console.log(moduleSettings)
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
    console.log(this.state.twitchMessages)
    let updatedPausedState = [...this.state.moduleSettings]
    updatedPausedState[moduleNum].paused = !this.state.moduleSettings[moduleNum].paused
    this.setState({moduleSettings: updatedPausedState})
  }

  changeChannel = (newChannel) => {
    
    socket.emit('leaveRoom')
    socket.emit('join', {username: this.state.username, room: newChannel, profileImage: this.state.profileImage})
    this.setState({twitchMessages: [], modMsgs: []})
    
      this.setState({currentChannel: newChannel}, ()=> {

        if(!this.state.channelHistory.includes(newChannel)){
          //set channel history for sockets
          this.setState({channelHistory: [...this.state.channelHistory, newChannel]})
          
          socket.on(newChannel, (messageData)=>{
            if(this.state.twitchMessages.length < 200){
                this.setState({twitchMessages: [...this.state.twitchMessages, messageData]})
            } else {
                this.setState({twitchMessages: [...this.state.twitchMessages.slice(1), messageData]})
            }
          })
        }

      })

  }

  clicked = () => {
    console.log(this.state.modList)
  }

  render(){

    let chatModules = []

    for(let i=0; i < this.state.twitchChatCount; i++){
      chatModules.push(
        <TwitchChatModule 
          className={styles.twitchModule} 
          key={this.state.twitchChatCount-i} 
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
        />
        </TwitchChatModule>
      )
    }

    let channelList = this.state.channelAccess.map((channelObject)=>{
      return(
      <div className={styles.profileImageContainer} key={channelObject.channel} onClick={()=>this.changeChannel(channelObject.channel)}>
        <img className={(channelObject.channel === this.state.currentChannel ? styles.currentChannel : styles.channelImage)} src={channelObject.channelImage} alt="Channel"/>
      </div>
      )
    })

    return (
      <div className={styles.application}>
        <div className={styles.navbar}>
          <div className={styles.buttonContainer}>
            {/* <div onClick={this.clicked} className={styles.navButton}/> */}
            <div className={styles.buttonSlot}>
              <button onClick={this.toggleModChatModule} className={styles.navButton} style={this.state.modChatEnabled ? {opacity: '100%'} : {opacity: '50%'}}>
                <img className={styles.modIcon} src={modIcon} alt="Mod Icon"/>
              </button>
            </div>
            <div className={styles.buttonSlot}>
              <button onClick={this.addTwitchChatModule} className={styles.navButton} id={styles.addButton}>+</button>
            </div>
          </div>
          <div className={styles.modListContainer}>
            {channelList}
          </div>
        </div>
        
        <div className={styles.chatModules}>
          <ModChatModule 
            className={styles.modModule} 
            visibility={this.state.modChatEnabled} 
            roomUsers={this.state.roomUsers}
            onMessageSubmit={this.onMessageSubmit} 
            usernameHandler={this.usernameHandler} 
            inputChangedHandler={this.inputChangedHandler}
            transferTwitchMsg={this.transferTwitchMsg}
            id="modModule"
            >
            <ModChatContent 
            modMsgs={this.state.modMsgs} 
            username={this.state.username}
            profileImage={this.state.profileImage}
            currentChannel={this.state.currentChannel}
            id="modCard"
            draggable="true"
            >
            </ModChatContent>
          </ModChatModule>
          {chatModules}
        </div>
      </div>
    );
  }
}

export default Main;
