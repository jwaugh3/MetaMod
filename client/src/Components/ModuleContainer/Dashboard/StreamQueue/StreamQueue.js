import React, { Component } from 'react'
//Components
import Queue from './Queue/Queue';
//Style
import styles from './StreamQueue.module.css';
//Assets
import filterButton from '../../../../resources/filterButton.png';
//State Management
import { connect } from 'react-redux'

export class StreamQueue extends Component {

    render() {

        let renderedQueue = [<Queue key={'1'}/>, <Queue key={'2'}/>]

        return (
            <div className={styles.mainContainer}>
                <div className={styles.headerContainer}>
                    <h3 className={styles.chatHeader}>Stream Queue</h3>
                    <img src={filterButton} className={styles.filterButton} alt="filter"/>
                </div>
                <div className={styles.queueContainer}>
                    {renderedQueue}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentChannel: state.applicationReducer.currentChannel
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StreamQueue)
