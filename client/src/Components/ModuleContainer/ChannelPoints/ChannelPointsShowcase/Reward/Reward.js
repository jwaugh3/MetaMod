import React, { Component } from 'react'
import { createRewardOnTwitch } from '../../customRewardHandler';
//Components
import Auxiliary from '../../../../../hoc/Auxiliary';
import ChannelPointsForm from './ChannelPointsForm/ChannelPointsForm';
import ToggleSwitch from '../../../../AssetComponents/ToggleSwitch/ToggleSwitch';
//Style
import styles from './Reward.module.scss';
//Assets
import costIcon from '../../../../../resources/customRewardIcon.png';
//State Management
import { connect } from 'react-redux';

class Reward extends Component {

    cancelForm = (event) => {
        event.preventDefault()

        this.props.displayFormHandler(this.props.displayForm.status, null)
        this.props.cancelFormHandler(this.props.badgeNum)
    }

    render() {
        return (
            <Auxiliary>

                <div className={styles.rewardContainer} style={this.props.visibility ? {visibility: 'visible'} : {visibility: 'hidden'}} 
                        onClick={()=>this.props.isManageable ? this.props.displayFormHandler(this.props.displayForm.status, this.props.badgeNum) : ''}>

                    <div className={styles.rewardBadge} style={{backgroundColor: this.props.badgeColor}}>
                        {this.props.isManageable ? 
                            <div className={styles.toggleContainer}>
                                <ToggleSwitch toggleHandler={()=>{
                                    this.props.toggleRewardStatus(this.props.badgeNum, this.props.customRewards[this.props.badgeNum].isEnabled)
                                    createRewardOnTwitch(this.props.apiEndpoint, this.props.currentChannel, this.props.setNewRewardID, this.props.customRewards, this.props.deleteFailedReward, this.props.setChannelPointAlert, this.props.badgeNum)
                                }} checked={this.props.visibility === false ? null : this.props.customRewards[this.props.badgeNum].isEnabled} option={'toggleRewardStatus' + this.props.badgeNum}/>
                            </div>
                            : null
                        }
                        <img className={styles.rewardIcon} src={this.props.rewardIcon} alt='reward icon'/>
                        <div className={styles.costContainer}>
                            <img className={styles.costIcon} src={costIcon} alt={'cost icon'}/>
                            <div className={styles.costText}>{this.props.rewardCost}</div>
                        </div>
                    </div>

                    <div className={styles.rewardTextContainer}>
                        <div className={styles.rewardText}>
                            {this.props.rewardText}
                        </div>
                    </div>
                </div>

                {this.props.displayForm.status && this.props.badgeNum === this.props.displayForm.badgeNum ?
                    <Auxiliary>
                        <ChannelPointsForm badgeNum={this.props.displayForm.badgeNum} apiEndpoint={this.props.apiEndpoint}/>
                        <div className={styles.rewardOffClick} onClick={(event)=>{
                            this.props.displayFormHandler(this.props.displayForm.status, null)
                            this.cancelForm(event)
                        }}></div>
                    </Auxiliary>
                    : null
                }
            </Auxiliary>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentChannel: state.applicationReducer.currentChannel,
        displayForm: state.channelPointReducer.displayForm,
        customRewards: state.channelPointReducer.customRewards
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        displayFormHandler: (status, badgeNum) => dispatch({type: 'DISPLAY_FORM', payload: {status, badgeNum}}),
        cancelFormHandler: (badgeNum) => dispatch({type: 'CANCEL_FORM', payload: badgeNum}),
        toggleRewardStatus: (badgeNum, status) => dispatch({type: 'TOGGLE_REWARD_STATUS', payload: {badgeNum, status}}),
        setNewRewardID: (newReward) => dispatch({type: 'SET_NEW_REWARD_ID', payload: newReward}),
        deleteFailedReward: () => dispatch({type: 'DELETE_FAILED_REWARD'}),
        setChannelPointAlert: (alert) => dispatch({type: 'SET_CHANNEL_POINT_ALERT', payload: alert})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reward);
