//Files
import React, {Component} from 'react';
//Components
import SettingsOption from './SettingsOption/SettingsOption';
//Styles
import styles from './Settings.module.css';
//Assets
//State Management
import { connect } from 'react-redux';


class Settings extends Component {
// moduleSettings : { moduleName: '', settingsDisplay: false, editModuleName: false, hideCommands: false, subscribersOnly: false }
    render() {
        let moduleSettings = this.props.moduleSettings[this.props.moduleNum]
        return ( 
            <div className={styles.popup} style={moduleSettings.settingsDisplay ? {display: ''} : {display: 'none'}} draggable='false'>
                <div className={styles.settingsContainer} draggable='false'>
                    <h3 className={styles.settingsHeader}>Chat Filters</h3>
                    <div/>
                    <div className={styles.subHeaderContainer}><h4 className={styles.subHeader}>User-Type</h4></div>
                    <SettingsOption settingsLabel={'Non-Sub Message'} settingsHandler={this.props.updateFilterNonsubscriberMessages} selected={moduleSettings.nonsubscribers} updateSettings={this.props.updateSettings} moduleNum={this.props.moduleNum}/>
                    <SettingsOption settingsLabel={'Sub Messages'} settingsHandler={this.props.updateFilterSubscriberMessages} selected={moduleSettings.subscribers} updateSettings={this.props.updateSettings} moduleNum={this.props.moduleNum}/>
                    <SettingsOption settingsLabel={'Mod Messages'} settingsHandler={this.props.updateFilterModMsgs} selected={moduleSettings.modMsgs} updateSettings={this.props.updateSettings} moduleNum={this.props.moduleNum}/>
                    <div className={styles.subHeaderContainer}><h4 className={styles.subHeader}>Always Show</h4></div>
                    <SettingsOption settingsLabel={'@' + this.props.currentChannel + " Mentions"} settingsHandler={this.props.updateFilterDirectMentions} selected={moduleSettings.directChat} updateSettings={this.props.updateSettings} moduleNum={this.props.moduleNum}/>
                    <SettingsOption settingsLabel={'Emotes'} settingsHandler={this.props.updateFilterEmotes} selected={moduleSettings.emotes} updateSettings={this.props.updateSettings} moduleNum={this.props.moduleNum}/>
                    <SettingsOption settingsLabel={'Commands'} settingsHandler={this.props.updateFilterCommands} selected={moduleSettings.commands} updateSettings={this.props.updateSettings} moduleNum={this.props.moduleNum}/>
                    <div/>

                    <div className={styles.removeChatContainer}>
                        <button className={styles.removeChatButton} onClick={()=>{
                            this.props.removeChatModuleFromState(this.props.moduleNum)
                            this.props.decreaseModuleCount(this.props.twitchChatCount)
                        }}><p className={styles.removeChatText}>Remove Chat Module</p></button>
                    </div>
                </div>
            </div>
        );
    }
}
    
const mapStateToProps = (state) => {
    return {
        currentChannel: state.applicationReducer.currentChannel,
        moduleSettings: state.twitchChatReducer.moduleSettings,
        twitchChatCount: state.twitchChatReducer.twitchChatCount
    }
  }

const mapDispatchToProps = (dispatch) => {
    return {
        removeChatModuleFromState: (moduleNum) => dispatch({type: 'REMOVE_CHAT_MODULE', payload: moduleNum}),
        decreaseModuleCount: (currentState) => dispatch({type: 'DECREASE_CHAT_MODULE_COUNT', payload: currentState}),
        //settings handlers:
        updateFilterCommands: (moduleNum, status) => dispatch({type: 'UPDATE_FILTER_COMMANDS', payload: {moduleNum: moduleNum, status: status}}),
        updateFilterSubscriberMessages: (moduleNum, status) => dispatch({type: 'UPDATE_FILTER_SUBSCRIBER_MESSAGES', payload: {moduleNum: moduleNum, status: status}}),
        updateFilterNonsubscriberMessages: (moduleNum, status) => dispatch({type: 'UPDATE_FILTER_NONSUBSCRIBER_MESSAGES', payload: {moduleNum: moduleNum, status: status}}),
        updateFilterDirectMentions: (moduleNum, status) => dispatch({type: 'UPDATE_FILTER_DIRECT_MENTIONS', payload: {moduleNum: moduleNum, status: status}}),
        updateFilterEmotes: (moduleNum, status) => dispatch({type: 'UPDATE_FILTER_EMOTES', payload: {moduleNum: moduleNum, status: status}}),
        updateFilterModMsgs: (moduleNum, status) => dispatch({type: 'UPDATE_FILTER_MOD_MSGS', payload: {moduleNum: moduleNum, status: status}})
    }
}
    
export default connect(mapStateToProps, mapDispatchToProps)(Settings);