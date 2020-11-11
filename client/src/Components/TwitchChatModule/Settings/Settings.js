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
                    <h3 className={styles.settingsHeader}>Chat Filters</h3>
                    <div/>
                    <div className={styles.subHeaderContainer}><h4 className={styles.subHeader}>User-Type</h4></div>
                    <SettingsOption settingsLabel={'Non-Sub Message'} settingsName={'NonSubscriber Messages'} selected={this.props.moduleSettings.nonsubscribers} updateSettings={this.props.updateSettings} moduleNum={this.props.moduleNum}/>
                    <SettingsOption settingsLabel={'Sub Messages'} settingsName={'Subscriber Messages'} selected={this.props.moduleSettings.subscribers} updateSettings={this.props.updateSettings} moduleNum={this.props.moduleNum}/>
                    <SettingsOption settingsLabel={'Mod Messages'} settingsName={'modMsgs'} selected={this.props.moduleSettings.modMsgs} updateSettings={this.props.updateSettings} moduleNum={this.props.moduleNum}/>
                    <div className={styles.subHeaderContainer}><h4 className={styles.subHeader}>Always Show</h4></div>
                    <SettingsOption settingsLabel={'@' + this.props.channel + " Mentions"} settingsName={'@' + this.props.channel} selected={this.props.moduleSettings.directChat} updateSettings={this.props.updateSettings} moduleNum={this.props.moduleNum}/>
                    <SettingsOption settingsLabel={'Emotes'} settingsName={'Emotes'} selected={this.props.moduleSettings.emotes} updateSettings={this.props.updateSettings} moduleNum={this.props.moduleNum}/>
                    <SettingsOption settingsLabel={'Commands'} settingsName={'Commands'} selected={this.props.moduleSettings.commands} updateSettings={this.props.updateSettings} moduleNum={this.props.moduleNum}/>
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