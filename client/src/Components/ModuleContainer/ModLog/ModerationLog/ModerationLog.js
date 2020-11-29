import React, { Component } from 'react'
import { connect } from 'react-redux'
//Styling
import styles from './ModerationLog.module.css'
//Components
import ModRecord from './ModRecord/ModRecord';

export class ModerationLog extends Component {
    render() {
        return (
            <div className={styles.mainContainer}>
                <div className={styles.headerContainer}>
                    <h3 className={styles.chatHeader}>Moderation Log</h3>
                </div>
                <div className={styles.logContainer}>
                    <ModRecord/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(ModerationLog)
