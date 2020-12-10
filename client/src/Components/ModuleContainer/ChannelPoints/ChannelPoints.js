import React, { Component } from 'react'
import { deleteCustomReward } from '../../../api/apiCall';
//Components
import Auxiliary from '../../../hoc/Auxiliary';
import TopNav from '../TopNav/TopNav';
import Loading from '../../AssetComponents/Loading/Loading';
import ChannelPointsShowcase from './ChannelPointsShowcase/ChannelPointsShowcase';
//Style
import styles from './ChannelPoints.module.css';
//State Management
import { connect } from 'react-redux'

class ChannelPoints extends Component {

    deleteCustomRewardOnTwitch = async (badgeNum) => {
        await deleteCustomReward(this.props.apiEndpoint, this.props.currentChannel, this.props.customRewards[badgeNum].rewardID).then((res)=>{
            let statusCode = JSON.parse(res.response.statusCode)
            if(statusCode === 204){
                this.props.deleteFormHandler(badgeNum)
            } else if(statusCode === 403){
                this.props.setChannelPointAlert('Uh Oh: MetaMod cannot delete that reward')
                setTimeout(()=>{
                    this.props.setChannelPointAlert('')
                }, 10000)
            } else if(statusCode === 401){
                this.props.setChannelPointAlert('Uh Oh: Unauthentication error on our end')
                setTimeout(()=>{
                    this.props.setChannelPointAlert('')
                }, 10000)
            }
        })
    }

    render() {
        let formDefault = {
            rewardName: '',
            rewardID: '',
            cost: '',
            description: '',
            //color picker
            backgroundColor: "#05a1e5",
            colorSelect: ['#05A1E5', '#8B35D8', '#00FF7F', '#FF0811', '#353435', '#73C2E4', '#B78BDD', '#71F1B1', '#F17579', '#8B8B8B'],
            displayPicker: false,
            showCustomizer: false,
            viewerInputRequired: false,
            addRedemption: true,
            cooldown: false,
            redemptionCooldownTimeLabel: 'seconds',
            redemptionCooldownTime: 0,
            redemptionPerStream: '',
            redemptionPerUser: '',
            isEnabled: true,
            isManageable: true
        }

        return (
            <Auxiliary>
                <TopNav>
                    {this.props.displayForm.status ? 
                        <button className={styles.cancelButton} onClick={()=>{
                            this.props.displayFormHandler(this.props.displayForm.status, null)
                            this.deleteCustomRewardOnTwitch(this.props.displayForm.badgeNum)
                        }}>Delete Reward</button>
                        : <button className={styles.createButton} onClick={()=>{
                            if(this.props.customRewards.length === 50){
                                this.props.setChannelPointAlert('There is a max of 50 custom rewards per channel. ')
                                setTimeout(()=>{
                                    this.props.setChannelPointAlert('')
                                }, 6000)
                            } else {
                                this.props.displayFormHandler(this.props.displayForm.status, 0)
                                this.props.createReward(formDefault)
                            }
                        }}>Create Custom Reward</button>
                    }
                </TopNav>
                {!this.props.channelPointsReceived ? 
                    <Loading/>
                    :
                    <div className={styles.channelPointsModule}>
                        <ChannelPointsShowcase apiEndpoint={this.props.apiEndpoint}/>                    
                    </div>
                }
            </Auxiliary>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentChannel: state.applicationReducer.currentChannel,
        customRewards: state.channelPointReducer.customRewards,
        displayForm: state.channelPointReducer.displayForm,
        channelPointsReceived: state.applicationReducer.channelPointsReceived
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        displayFormHandler: (status, badgeNum) => dispatch({type: 'DISPLAY_FORM', payload: {status, badgeNum}}),
        createReward: (rewardData) => dispatch({type: 'CREATE_REWARD', payload: rewardData}),
        cancelFormHandler: (badgeNum) => dispatch({type: 'CANCEL_FORM', payload: badgeNum}),
        deleteFormHandler: (badgeNum) => dispatch({type: 'DELETE_FORM', payloda: badgeNum}),
        setNewRewardID: (newReward) => dispatch({type: 'SET_NEW_REWARD_ID', payload: newReward}),
        setChannelPointAlert: (alert) => dispatch({type: 'SET_CHANNEL_POINT_ALERT', payload: alert})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelPoints)
