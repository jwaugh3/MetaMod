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
                    <SettingsOption settingsName={'Hide Commands'} selected={this.props.moduleSettings.hideCommands} updateSettings={this.props.updateSettings} moduleNum={this.props.moduleNum}/>
                    <SettingsOption settingsName={'Subscribers Only'} selected={this.props.moduleSettings.subscribersOnly} updateSettings={this.props.updateSettings} moduleNum={this.props.moduleNum}/>
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