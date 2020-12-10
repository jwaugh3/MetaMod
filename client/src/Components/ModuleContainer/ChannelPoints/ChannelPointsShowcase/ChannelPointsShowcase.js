import React, { Component } from 'react'
//Components
import Reward from './Reward/Reward';
//Style
import styles from './ChannelPointsShowcase.module.css';
//Assets
import tempIcon from '../../../../resources/unlockEmoteIcon.png';
//State Management
import { connect } from 'react-redux'

export class ChannelPointsShowcase extends Component {

    render() {
        let renderedCustomRewards = []
        let renderedManageableCustomRewards = []

        this.props.customRewards.forEach((reward)=>{
            if(!reward.isManageable){
                renderedCustomRewards.push(
                    <Reward 
                        key={this.props.customRewards.indexOf(reward)} 
                        badgeNum={this.props.customRewards.indexOf(reward)}
                        rewardText={reward.rewardName} 
                        rewardCost={reward.cost} 
                        rewardIcon={tempIcon} 
                        badgeColor={reward.backgroundColor}
                        visibility={true}
                        isManageable={reward.isManageable}
                        apiEndpoint={this.props.apiEndpoint}
                    />
                )
            } else {
                renderedManageableCustomRewards.push(
                    <Reward 
                    key={this.props.customRewards.indexOf(reward)} 
                    badgeNum={this.props.customRewards.indexOf(reward)}
                    rewardText={reward.rewardName} 
                    rewardCost={reward.cost} 
                    rewardIcon={tempIcon} 
                    badgeColor={reward.backgroundColor}
                    visibility={true}
                    isManageable={reward.isManageable}
                    apiEndpoint={this.props.apiEndpoint}
                />
                )
            }
        })
       

        return (
            <div className={styles.showcaseContainer}>
                <div className={styles.headerContainer}>
                    <h3 className={styles.headerText}>
                        Existing Rewards
                        {this.props.channelPointAlert !== '' ? <div className={styles.channelPointsAlert}>
                            {this.props.channelPointAlert}
                            <img src='https://cdn.betterttv.net/emote/5e0fa9d40550d42106b8a489/1x' alt="sadge"/>
                            </div> 
                            : null}
                    </h3>
                </div>
                    {this.props.customRewards.length > 0 ? 
                        <div className={styles.rewardScrollContainer}>
                            <div className={styles.customContainer}>
                                <div className={styles.customHeader}>Custom Rewards</div>
                                <div className={styles.rewardContainer}>
                                    {this.props.customRewards.length > 0 ?
                                        renderedManageableCustomRewards
                                        : <p>Create a reward by clicking the button at the top.</p>
                                    }                       
                                </div>
                            </div>
                            <div className={styles.customContainer}>
                                <div className={styles.customHeader}>Twitch Managed Rewards</div>
                                
                                    <a target="_blank" rel="noopener noreferrer" style={{display: 'inline'}} href={'https://dashboard.twitch.tv/u/jwaugh3/community/channel-points'}>
                                    <div className={styles.channelPointLink}>
                                        <p className={styles.channelPointText}>Manage these rewards here</p>
                                        <div className={styles.svg}>
                                            <svg height="20px" width="20px">
                                                <path transform="scale(0.034)" fill="currentColor" d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"></path>
                                            </svg>
                                        </div>
                                        </div>
                                    </a>
                                    
                                
                                <div className={styles.rewardContainer}>
                                    {this.props.customRewards.length > 0 ?
                                        renderedCustomRewards
                                        : <Reward visibility={false}/>
                                    }                       
                                </div>
                            </div>
                        </div>
            : <div className={styles.noRecords}>This feature requires the channel to be affiliate/partner <img src="https://cdn.betterttv.net/emote/59f27b3f4ebd8047f54dee29/2x" alt='doggo'/></div>}
                    </div>
                    
        )
    }
}

const mapStateToProps = (state) => {
    return {
        customRewards: state.channelPointReducer.customRewards,
        channelPointAlert: state.channelPointReducer.channelPointAlert
    }
}

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelPointsShowcase)
