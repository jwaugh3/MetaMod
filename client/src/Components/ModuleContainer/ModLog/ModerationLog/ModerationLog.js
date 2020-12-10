import React, { Component } from 'react'
import moment from 'moment';
import { connect } from 'react-redux'
//Styling
import styles from './ModerationLog.module.css'
//Components
import ModRecord from './ModRecord/ModRecord';

export class ModerationLog extends Component {

    componentDidUpdate

    render() {
        let existingRecords

        if(this.props.modLogs === null){
            existingRecords = <div className={styles.noRecords}>Much Empty. Such Wow. <img src="https://cdn.betterttv.net/emote/5b4da69ca13f8e3953e28902/2x" alt='doggo'/></div>
        } else {
            
            existingRecords = this.props.modLogs.map((record)=>{
                if(this.props.filter.includes(record.mod)){
                    let key = this.props.modLogs.indexOf(record)
                
                    switch(record.type){
                        case 'timeout': return <ModRecord key={key} modUsername={record.mod} viewer={record.event.username} time={moment.utc(record.timestamp).startOf().fromNow()} action={record.type} duration={record.event.duration} status={null} deletedMessage={null}/>
                        case 'messagedeleted': return <ModRecord key={key} modUsername={record.mod} viewer={record.event.username} time={moment.utc(record.timestamp).startOf().fromNow()} action={record.type} duration={null} status={null} deletedMessage={record.event.deletedMessage}/>
                        case 'ban': return <ModRecord key={key} modUsername={record.mod} viewer={record.event.username} time={moment.utc(record.timestamp).startOf().fromNow()} action={record.type} duration={null} status={null} deletedMessage={null}/>
                        case 'emoteonly': return <ModRecord key={key} modUsername={record.mod} viewer={record.event.username} time={moment.utc(record.timestamp).startOf().fromNow()} action={record.type} duration={null} status={record.event.status} deletedMessage={null}/>
                        case 'followersonly': return <ModRecord key={key} modUsername={record.mod} viewer={record.event.username} time={moment.utc(record.timestamp).startOf().fromNow()} action={record.type} duration={record.event.duration} status={record.event.status} deletedMessage={null}/>
                        case 'slowmode': return <ModRecord key={key} modUsername={record.mod} viewer={record.event.username} time={moment.utc(record.timestamp).startOf().fromNow()} action={record.type} duration={record.event.duration} status={record.event.status} deletedMessage={null}/>
                        default: return <div>No records to display.</div>
                    }
                } else {
                    return null
                }
            })
        }

        return (
            <div className={styles.mainContainer}>
                <div className={styles.headerContainer}>
                    <h3 className={styles.logHeader}>Moderation Log</h3>
                </div>
                <div className={styles.logContainer}>
                    {existingRecords}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        modLogs: state.modLogsReducer.modLogs
    }
}

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(ModerationLog)
