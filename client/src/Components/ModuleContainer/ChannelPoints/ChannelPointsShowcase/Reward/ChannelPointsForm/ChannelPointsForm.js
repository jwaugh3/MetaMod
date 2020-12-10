import React, { Component } from 'react'
import { createRewardOnTwitch } from '../../../customRewardHandler';
//Components
import Form from './Form/Form';
//Style
import styles from './ChannelPointsForm.module.css';
//State Management
import { connect } from 'react-redux'

class ChannelPointsForm extends Component {

    state = {
        alert: false
    }

    submitForm = (event, badgeNum) =>{
        event.preventDefault()
        let customRewards = this.props.customRewards[this.props.badgeNum]
        if(customRewards.rewardName !== '' && !isNaN(customRewards.cost) && customRewards.cost !== ''){
            this.props.displayFormHandler(this.props.displayForm.status, this.props.badgeNum)
            this.setState({alert: false})
            createRewardOnTwitch(this.props.apiEndpoint, this.props.currentChannel, this.props.setNewRewardID, this.props.customRewards, this.props.deleteFailedReward, this.props.setChannelPointAlert, this.props.badgeNum)
        } else {
            this.setState({alert: true})
        }
    }

    render() {
        return (
            <div className={styles.moduleContainer}>
                <div className={styles.formContainer}>
                    <Form submitForm={this.submitForm} alert={this.state.alert} badgeNum={this.props.badgeNum}/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentChannel: state.applicationReducer.currentChannel,
        customRewards: state.channelPointReducer.customRewards,
        displayForm: state.channelPointReducer.displayForm
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createReward: (rewardData) => dispatch({type: 'CREATE_REWARD', payload: rewardData}),
        displayFormHandler: (status, badgeNum) => dispatch({type: 'DISPLAY_FORM', payload: {status, badgeNum}}),
        setNewRewardID: (newReward) => dispatch({type: 'SET_NEW_REWARD_ID', payload: newReward}),
        deleteFailedReward: () => dispatch({type: 'DELETE_FAILED_REWARD'}),
        setChannelPointAlert: (alert) => dispatch({type: 'SET_CHANNEL_POINT_ALERT', payload: alert})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelPointsForm);
