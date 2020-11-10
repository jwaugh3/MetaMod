//Files
import React, {Component} from 'react';
//Components
import SettingsOption from './SettingsOption/SettingsOption';
//Styles
import styles from './Settings.module.css';
//Assets


class Settings extends Component {
// moduleSettings : { moduleName: '', settingsDisplay: false, editModuleName: false, hideCommands: false, subscribersOnly: false }
    render() {
        return ( 
            <div className={styles.popup} style={this.props.display ? {display: ''} : {display: 'none'}} draggable='false'>
                <div className={styles.settingsContainer} draggable='false'>
                    <h3 className={styles.settingsHeader}>Settings</h3>
                    <div/>
                    <SettingsOption settingsLabel={'Hide Commands'} settingsName={'Hide Commands'} selected={this.props.moduleSettings.hideCommands} updateSettings={this.props.updateSettings} moduleNum={this.props.moduleNum}/>
                    <SettingsOption settingsLabel={'Subscribers Only'} settingsName={'Subscribers Only'} selected={this.props.moduleSettings.subscribersOnly} updateSettings={this.props.updateSettings} moduleNum={this.props.moduleNum}/>
                    <SettingsOption settingsLabel={'Mod Messages'} settingsName={'modMsgs'} selected={this.props.moduleSettings.modMsgs} updateSettings={this.props.updateSettings} moduleNum={this.props.moduleNum}/>
                    <SettingsOption settingsLabel={'Show @' + this.props.channel} settingsName={'@' + this.props.channel} selected={this.props.moduleSettings.directChat} updateSettings={this.props.updateSettings} moduleNum={this.props.moduleNum}/>
                    <SettingsOption settingsLabel={'Hide Emotes'} settingsName={'Hide Emotes'} selected={this.props.moduleSettings.hideEmotes} updateSettings={this.props.updateSettings} moduleNum={this.props.moduleNum}/>
                    <div/>
                    <div className={styles.removeChatContainer}>
                        <button className={styles.removeChatButton} onClick={()=>this.props.removeChatModule(this.props.moduleNum)}><p className={styles.removeChatText}>Remove Chat Module</p></button>
                    </div>
                </div>
            </div>
        );
    }
}
    
export default Settings;