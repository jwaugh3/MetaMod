import React, { Component } from 'react';
import apiCall from '../../functions/apiCall';
import queryString from 'querystring';
import { hotjar } from 'react-hotjar';
//Components
import Dashboard from '../Dashboard/Dashboard';
//Styles
import styles from './Main.module.scss';
//Resources
import modIcon from '../../resources/modIcon.png';
import socket from '../../socket';


class Main extends Component {

  state = {
    username: '',
    login_username: '',
    twitchID: '',
    profileImage: '',
    modList: [],
    currentChannel: '',
    channelAccess: [],
    channelHistory: [],
    roomUsers: [],
    inProduction: true,
    url: '',
    apiEndpoint: ''
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

    hotjar.initialize(2097164, 6)
    
    //Get query from url
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed['?access_token'];
    let twitchID = parsed['twitch_id']
    
    this.setState({accessToken: accessToken, twitchID: twitchID})

    await apiCall.getUserDetails(this.state.apiEndpoint, twitchID).then((userData)=>{
      // console.log(userData)
      this.setState({
        username: userData.username, 
        profileImage: userData.profileImage, 
        login_username: userData.login_username, 
        currentChannel: userData.login_username, 
        channelAccess: userData.channelAccess
      })
    })

    await apiCall.getMods(this.state.apiEndpoint, this.state.currentChannel).then((data)=>{
      this.setState({modList: data.mods})
    })

    socket.on('roomUsers', (roomUsers)=>{
      // console.log(roomUsers)
      let newUsers = roomUsers.users
      this.setState({roomUsers: newUsers})
    })

    this.changeChannel(this.state.currentChannel)

  }

  changeChannel = (newChannel) => {
    socket.emit('leaveRoom')
    socket.emit('join', {username: this.state.username, room: newChannel, profileImage: this.state.profileImage})
    
    
      this.setState({currentChannel: newChannel}, ()=> {

        if(!this.state.channelHistory.includes(newChannel)){
          //set channel history for sockets
          this.setState({channelHistory: [...this.state.channelHistory, newChannel]})
        }

      })
  }


  render(){

    let channelList = this.state.channelAccess.map((channelObject)=>{
      return(
      <div className={styles.profileImageContainer} key={channelObject.channel} onClick={()=>this.changeChannel(channelObject.channel)}>
        <img className={(channelObject.channel === this.state.currentChannel ? styles.currentChannel : styles.channelImage)} src={channelObject.channelImage} alt="Channel"/>
      </div>
      )
    })

    //set background star pattern
    let backgroundMask = Array(15)
    let iterator = backgroundMask.keys()
    for(const key of iterator){
      backgroundMask[key] = <div className={styles.star} key={key}>+</div>
    }

    return (
      <div className={styles.application}>
        <div className={styles.navbar}>
          <div className={styles.buttonContainer}>
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
        
        <Dashboard
            key={this.state.currentChannel}
            className={styles.modModule} 
            roomUsers={this.state.roomUsers}
            username={this.state.username}
            profileImage={this.state.profileImage}
            currentChannel={this.state.currentChannel}
            apiEndpoint={this.state.apiEndpoint}
            channelHistory={this.state.channelHistory}
        />
                
        {backgroundMask}
      </div>
    );
  }
}

export default Main;
