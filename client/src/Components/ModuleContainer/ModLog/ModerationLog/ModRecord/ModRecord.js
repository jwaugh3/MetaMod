import React, { Component } from 'react'
//Styling
import styles from './ModRecord.module.css';
//Assets
import modIcon from '../../../../../resources/lightModIcon.png';

class ModRecord extends Component {
    render() {
        return (
            <div className={styles.recordContainer}>
                <div className={styles.headerContainer}>
                    <p className={styles.modUsername}>{this.props.modUsername}</p>
                    <img src={modIcon} alt="mod Icon" className={styles.modIcon}/>
                </div>
                <div className={styles.recordSpacer}></div>
                <div className={styles.bodyContainer}>
                    <div className={styles.recordTime}>
                        {this.props.time}
                    </div>
                    <div className={styles.recordAction}>
                        {this.props.action}
                    </div>
                </div>
            </div>
        )
    }
}

export default ModRecord;