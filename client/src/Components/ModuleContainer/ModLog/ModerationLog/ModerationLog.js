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
                    <h3 className={styles.logHeader}>Moderation Log</h3>
                </div>
                <div className={styles.logContainer}>
                    <ModRecord modUsername={'Jwaugh3'} time={'Nov 12, 8:15pm'} action={'this is filler text, you shouldnt read any of this text if you want to be productive'}/>
                    <ModRecord modUsername={'Jwaugh3adsfasdfasd'} time={'Jul 23, 12:15pm'} action={'this is filler text, you shouldnt read any of this text if you want to be productive'}/>
                    <ModRecord modUsername={'Jwaugh3asdf'} time={'Nov 12, 8:15pm'} action={'this is filler text, you shouldnt read any of this text if you want to be productiveasdfasdf sadf asdfasdfas asdfda asdffasdf asdfafasd asdfasdfa asdfasdfsa asdfsafdas sadfasdfdasf asdf'}/>
                    <ModRecord modUsername={'Jwaugh3dfa'} time={'Nov 12, 8:15pm'} action={'this is filler text, you shouldnt read any of this text if you want to be productive'}/>
                    <ModRecord modUsername={'Jwau'} time={'Nov 12, 8:15pm'} action={'this is filler text, you shouldnt'}/>
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
