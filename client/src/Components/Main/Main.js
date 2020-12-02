import React, { Component } from 'react';
import apiCall from '../../api/apiCall';
import queryString from 'querystring';
//Components
import Dashboard from '../ModuleContainer/Dashboard/Dashboard';
import ModuleContainer from '../ModuleContainer/ModuleContainer';
import NavButton from './NavButton/NavButton';
import ModLog from '../ModuleContainer/ModLog/ModLog';
//Styles
import styles from './Main.module.scss';
//Resources
import socket from '../../socket';
import logo from '../../resources/Logo.png';
//State Management
import { connect } from 'react-redux';

class Main extends Component {

  state = {
    inProduction: true,
    url: '',
    apiEndpoint: '',
    activeTab: 'Dashboard'
  }
  
  componentDidMount = async () => {

    if(window.location.host !== 'localhost:3000'){
      await this.setState({
        inProduction: true,
        url: 'https://metamoderation.com',
        apiEndpoint: 'https://api.metamoderation.com'
      })
    } else {
      await this.setState({
        inProduction: false,
        url: 'http://localhost:3000',
        apiEndpoint: 'http://localhost:5000'
      })
    }
    
    //Get query from url
    let parsed = queryString.parse(window.location.search);
    let twitchID = parsed['?twitch_id']
    this.props.setTwitchID(twitchID)

    await apiCall.getUserDetails(this.state.apiEndpoint, this.props.twitchID).then((userData)=>{
      //set global states
      this.props.setCurrentChannel(userData.login_username)
      this.props.setUsername(userData.username)
      this.props.setLoginUsername(userData.login_username)
      this.props.setProfileImage(userData.profileImage)
      this.props.setChannelAccess(userData.channelAccess)
    })

    await apiCall.getMods(this.state.apiEndpoint, this.props.currentChannel).then((data)=>{
      this.props.setModList(data.mods)
    })

    socket.on('roomUsers', (roomUsers)=>{
      let newUsers = roomUsers.users
      this.props.setRoomUsers(newUsers)
    })

    this.changeChannel(this.props.currentChannel)

    socket.on('newModMsg', (modMsg)=>{
      this.props.newModMsg(modMsg)
    })

    await apiCall.getEmotes(this.state.apiEndpoint, this.props.currentChannel)
        .then((channelEmotes)=>{
          this.props.addChannelEmotes(channelEmotes[0])
          this.props.addChannelEmoteCodes(channelEmotes[1])
          this.props.addChannelEmoteIDByName(channelEmotes[2])
        })

  }



  changeChannel = (newChannel) => {
    socket.emit('leaveRoom')
    socket.emit('join', {username: this.props.username, room: newChannel, profileImage: this.props.profileImage})
    
    //set global state of new channel
    this.props.setCurrentChannel(newChannel)


    if(!this.props.channelHistory.includes(newChannel)){
      //set channel history for sockets
      this.props.addChannelHistory(newChannel)

      //create current channel socket connection for twitch messages
      socket.on(newChannel, (messageData)=>{
        this.props.addTwitchMessage(messageData)
      })
    }

    this.props.clearTwitchMessages()
    this.props.clearModMsgs()
  }

  switchComponent = (newComponent) => {
    this.setState({activeTab: newComponent})
  }


  render(){

    let channelList = this.props.channelAccess.map((channelObject)=>{
      return(
      <div className={styles.profileImageContainer} key={channelObject.channel} onClick={()=>this.changeChannel(channelObject.channel)}>
        <img className={(channelObject.channel === this.props.currentChannel ? styles.currentChannel : styles.channelImage)} src={channelObject.channelImage} alt="Channel"/>
        <p className={styles.channelAccessName}>{channelObject.channel}</p>
      </div>
      )
    })

    //set background star pattern
    let backgroundMask = Array(15)
    let iterator = backgroundMask.keys()
    for(const key of iterator){
      backgroundMask[key] = <div className={styles.star} key={key}>+</div>
    }

    //render current module
    let renderedModule = () => {
      switch(this.state.activeTab) {
        case "Dashboard":  return <Dashboard apiEndpoint={this.state.apiEndpoint} /> 
        case "ModLog":  return <ModLog apiEndpoint={this.state.apiEndpoint}/>
        default:  return <h1>Uh oh, something went wrong. Contact the Dev!</h1>
      }
    }

    return (
      <div className={styles.application}>

        {/* side nav */}
        <div className={styles.navbar}>
          <div className={styles.logoContainer}>
            <div className={styles.logoSubContainer} onClick={()=>window.location = 'home'}>
                <img src={logo} className={styles.logo} alt="logo"/>
                <div className={styles.textContainer}>
                    <h1 className={styles.logoText}>MetaMod</h1>
                </div>
            </div>
          </div>
            <NavButton title={'Dashboard'} activeTab={this.state.activeTab} switchComponent={this.switchComponent}/>
            <NavButton title={'ModLog'} activeTab={this.state.activeTab} switchComponent={this.switchComponent}/>
          <div className={styles.modListContainer}>
            {channelList}
          </div>
        </div>    

        <ModuleContainer>
          {renderedModule()}
        </ModuleContainer>
                
        {backgroundMask}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentChannel: state.applicationReducer.currentChannel,
    username: state.applicationReducer.username,
    twitchID: state.applicationReducer.twitchID,
    profileImage: state.applicationReducer.profileImage,
    channelAccess: state.applicationReducer.channelAccess,
    channelHistory: state.applicationReducer.channelHistory
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    //application
    setUsername: (username) => dispatch({type: 'SET_USERNAME', payload: username}),
    setLoginUsername: (login_username) => dispatch({type: 'SET_LOGIN_USERNAME', payload: login_username}),
    setTwitchID: (twitchID) => dispatch({type: 'SET_TWITCH_ID', payload: twitchID}),
    setProfileImage: (profileImage) => dispatch({type: 'SET_PROFILE_IMAGE', payload: profileImage}),
    setChannelAccess: (channelAccess) => dispatch({type: 'SET_CHANNEL_ACCESS', payload: channelAccess}),
    setModList: (modList) => dispatch({type: 'SET_MOD_LIST', payload: modList}),
    setRoomUsers: (roomUsers) => dispatch({type: 'SET_ROOM_USERS', payload: roomUsers}),
    setAccessToken: (accessToken) => dispatch({type: 'SET_ACCESS_TOKEN', payload: accessToken}),
    setCurrentChannel: (channel) => dispatch({type: 'SET_CURRENT_CHANNEL', payload: channel}),
    addChannelHistory: (newChannel) => dispatch({type: 'ADD_CHANNEL_HISTORY', payload: newChannel}),
    //modChat
    newModMsg: (modMsg) => dispatch({type: 'NEW_MOD_MSG', payload: modMsg}),
    clearModMsgs: () => dispatch({type: 'CLEAR_MOD_MSGS'}),
    //twitchChat
    addTwitchMessage: (messageData) => dispatch({type: 'ADD_TWITCH_MESSAGE', payload: messageData}),
    clearTwitchMessages: () => dispatch({type: 'CLEAR_TWITCH_MESSAGES'}),
    addChannelEmotes: (emotes) => dispatch({type: 'ADD_CHANNEL_EMOTES', payload: emotes}),
    addChannelEmoteCodes: (emoteCodes) => dispatch({type: 'ADD_CHANNEL_EMOTE_CODES', payload: emoteCodes}),
    addChannelEmoteIDByName: (emoteIDByName) => dispatch({type: 'ADD_CHANNEL_EMOTE_ID_BY_NAME', payload: emoteIDByName})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);