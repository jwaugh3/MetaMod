import React, { Component } from 'react'
//Style
import styles from './Queue.module.css';
//Assets
import checked from '../../../../../resources/checked.png';
import unchecked from '../../../../../resources/unchecked.png';
//State Management
import { connect } from 'react-redux'

export class Queue extends Component {
    render() {
        return (
            <div className={styles.queueContainer}>
               <div className={styles.queueCheckContainer}>
                    <img className={styles.statusIcon} src={checked} alt="checked"/>
               </div>
               <div className={styles.queueMessageContainer}>
                    <div className={styles.queueMessage}>
                        <p className={styles.queueText}>This is a test to see if it will work when the text is super long so we will test it like this</p>
                    </div>
               </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {

    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Queue)