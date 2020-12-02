import React, { Component } from 'react'
//Styling
import styles from './ModRecord.module.css';
//Assets
import modIcon from '../../../../../resources/lightModIcon.png';

class ModRecord extends Component {
    render() {
        let recordOutput = ''

        if(this.props.action === 'timeout'){
            recordOutput = <div><p className={styles.viewer}>{this.props.viewer}</p>: <p className={styles.actionText}>timed out</p> (<p className={styles.duration}>{this.props.duration}s</p>)</div>
        } else if(this.props.action === 'messagedeleted'){
            recordOutput = <div className={styles.logContainer}><p className={styles.viewer}>{this.props.viewer}'s</p>: <p className={styles.actionText}>message deleted</p> - <br/> <p className={styles.duration}>{this.props.deletedMessage}</p></div>
        } else if(this.props.action === 'ban'){
            recordOutput = <div><p className={styles.viewer}>{this.props.viewer}</p>: <p className={styles.actionText}>banned</p></div>
        } else if(this.props.action === 'emoteonly'){
            recordOutput = <div>emote only {this.props.status === true ? <p className={styles.statusTrue}>enabled</p> : <p className={styles.statusFalse}>disabled</p>}</div>
        } else if(this.props.action === 'followersonly'){
            recordOutput = <div>followers only {this.props.status == true ? <p className={styles.statusTrue}>enabled</p> : <p className={styles.statusFalse}>disabled</p>} (<p className={styles.duration}>{this.props.duration}s</p>)</div>
        } else if(this.props.action === 'slowmode'){
            recordOutput = <div>slowmode {this.props.status == true ? <p className={styles.statusTrue}>enabled</p> : <p className={styles.statusFalse}>disabled</p>} (<p className={styles.duration}>{this.props.duration}s</p>)</div>
        }


        return (
            <div className={styles.recordContainer}>
                <div className={styles.headerContainer}>
                    <p className={styles.modUsername}>{this.props.modUsername}</p>
                    <img src={modIcon} alt="mod Icon" className={styles.modIcon}/>
                </div>
                <div className={styles.recordSpacer}></div>
                <div className={styles.bodyContainer}>
                    <div className={styles.recordTime}>
                        {this.props.time.toLocaleString()}
                    </div>
                    <div className={styles.recordAction}>
                        {recordOutput}
                    </div>
                </div>
            </div>
        )
    }
}

export default ModRecord;