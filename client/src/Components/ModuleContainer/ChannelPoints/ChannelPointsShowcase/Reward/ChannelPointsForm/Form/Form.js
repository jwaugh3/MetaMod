import React, { Component } from 'react'
import { BlockPicker, ChromePicker} from 'react-color'
//Components
import Auxiliary from '../../../../../../../hoc/Auxiliary';
import ToggleSwitch from '../../../../../../AssetComponents/ToggleSwitch/ToggleSwitch';
import SingleSelectDropdown from '../../../../../../AssetComponents/SingleSelectDropdown/SingleSelectDropdown';
//Style
import styles from './Form.module.scss';
//Assets
import editIcon from '../../../../../../../resources/editEmoteIcon.png'
//State Management
import { connect } from 'react-redux'

export class Form extends Component {

    render() {

        let badgeNum = this.props.badgeNum
        let customRewards = this.props.customRewards[this.props.badgeNum]
        let renderedPicker = []
        let offClick = []

        if(customRewards.displayPicker === true && customRewards.showCustomizer === true){
            renderedPicker = [
                <Auxiliary key={'dispPickerAndShowCustomizer'}>
                    <ChromePicker
                        className={styles.chromeColorPicker}
                        color={ customRewards.backgroundColor }
                        disableAlpha={true}
                        onChangeComplete={(color)=>this.props.handleColorChangeComplete(color, badgeNum)}
                    />
                    <div className={styles.customColor} onClick={()=>this.props.showCustomPicker(customRewards.showCustomizer, badgeNum)} style={{backgroundColor: customRewards.backgroundColor}}>More Colors...</div>
                </Auxiliary>
            ]
            offClick = [
                <div key={'dispPickerAndShowCustomizerOffClick'} className={styles.offClick} onClick={()=>this.props.toggleColorSelect(customRewards.displayPicker, badgeNum)}></div>
            ]
        } else if(customRewards.displayPicker === true){
            renderedPicker = [
                <Auxiliary key={'dispPickerOnly'}>
                    <BlockPicker
                        className={styles.colorPicker}
                        color={ customRewards.backgroundColor }
                        colors={customRewards.colorSelect}
                        onChangeComplete={ (color)=>this.props.handleColorChangeComplete(color, badgeNum) }
                    /> 
                <div className={styles.customColor} onClick={()=>this.props.showCustomPicker(customRewards.showCustomizer, badgeNum)} style={{backgroundColor: customRewards.backgroundColor}}>More Colors...</div>
                </Auxiliary>
            ]
            offClick = [
                <div key={'offClickDispOnly'} className={styles.offClick} onClick={()=>this.props.toggleColorSelect(customRewards.displayPicker, badgeNum)}></div>
            ]
        } else {
            renderedPicker = null
            offClick = null
        }

        return (
            <div className={styles.formContainer}>
                {offClick}
                <div className={styles.headerContainer}>
                    <h3 className={styles.headerText}>
                        Create Custom Reward
                    </h3>
                </div>

                <div className={styles.form}>

                    <form>
                        <label htmlFor="rewardName" id="nameLabel">Custom Reward Name</label>
                        <input type="text" maxLength="45" id="rewardName" value={customRewards.rewardName} className={styles.inputBox} onChange={(event)=>{
                            this.props.setInputValue(event, 'rewardName', badgeNum)
                        }}/>
                        <label htmlFor="rewardName" id="charCount">{customRewards.rewardName.length}/45</label>

                        <div className={styles.formSpacer}></div>

                        <div className={styles.formGrid}>
                            <div>
                                <label htmlFor="cost" id="costLabel">Cost</label>
                                <input type="text" maxLength="8" id="cost" value={customRewards.cost} onChange={(event)=>this.props.setInputValue(event, 'cost', badgeNum)} className={styles.costInput}/>
                            </div>

                            <div className={styles.colorSelectContainer}>
                                <label htmlFor="color" id="colorLabel">Reward Color</label>
                                <div className={styles.colorContainer} onClick={()=>this.props.toggleColorSelect(customRewards.displayPicker, badgeNum)} style={{backgroundColor: customRewards.backgroundColor}}>
                                    <div className={styles.editButton}>
                                        <img src={editIcon} className={styles.editIcon} alt="edit Icon"/>
                                    </div>
                                </div>
        
                                {renderedPicker}
                            </div>

                        </div>

                        <div className={styles.formSpacer}></div>

                        <label htmlFor="description" id="descriptionTitle">Description</label>
                        <label htmlFor="description" id="optional">(optional)</label>
                        <label htmlFor="description" id="descCharCount">{customRewards.description.length}/200</label>
                        <textarea maxLength="200" id="description" value={customRewards.description} onChange={(event)=>{
                            this.props.setInputValue(event, 'description', badgeNum)
                        }}/>

                        <div className={styles.formSpacer}></div>

                        <label htmlFor="viewerInputRequired" id="viewerInputToggleLabel" className={styles.userSelect}>Require Viewer Input</label>
                        <ToggleSwitch toggleHandler={()=>this.props.toggleHandler(customRewards.viewerInputRequired, 'viewerInputRequired', badgeNum)} checked={customRewards.viewerInputRequired} option={'viewerInputRequired'}/>

                        <div className={styles.formSpacer}></div>

                        <label htmlFor="addRedemption" id="addRedemptionLabel" className={styles.userSelect}>Add Redemption to Review Queue</label>
                        <ToggleSwitch toggleHandler={()=>this.props.toggleHandler(customRewards.addRedemption, 'addRedemption', badgeNum)} checked={customRewards.addRedemption} option={'addRedemption'}/>

                        <div className={styles.formSpacer}></div>

                        <label htmlFor="cooldown" id="cooldownLabel" className={styles.userSelect}>Cooldown/Limits</label>
                        <ToggleSwitch toggleHandler={()=>this.props.toggleHandler(customRewards.cooldown, 'cooldown', badgeNum)} checked={customRewards.cooldown} option={'cooldown'}/>

                        <div className={styles.formSpacer}></div>

                        {customRewards.cooldown ? 
                            <div className={styles.cooldownContainer}>
                                    <label htmlFor="redemptionCooldown" id="redemptionCooldownLabel">Redemption Cooldown</label>
                                    <div className={styles.optionGrid}>
                                        <input type="text" maxLength="10" id="redemptionCooldown" value={customRewards.redemptionCooldownTime} onChange={(event)=>this.props.setInputValue(event, 'redemptionCooldownTime', badgeNum)} className={styles.cooldownInput}/>
                                        <SingleSelectDropdown selected={customRewards.redemptionCooldownTimeLabel} options={['seconds', 'minutes', 'hours']} onSelect={this.props.onSelect} badgeNum={badgeNum}/>
                                    </div>
                            
                                <div className={styles.cooldownOption}>
                                    <label htmlFor="maxRedemptionPerStream" id="maxRedemptionPerStreamLabel">Max Redemptions Per Stream</label>
                                    <label htmlFor="maxRedemptionsPerStream" id="optional">(optional)</label>
                                    <input type="text" maxLength="6" id="maxRedemptionsPerStream" value={customRewards.redemptionPerStream} className={styles.inputBox} onChange={(event)=>this.props.setInputValue(event, 'redemptionPerStream', badgeNum)}/>
                                </div>
                                
                                <div className={styles.cooldownOption}>
                                    <label htmlFor="maxRedemptionPerUser" id="maxRedemptionPerUserLabel">Max Redemptions Per User</label><label htmlFor="maxRedemptionsPerUser" id="optional">(optional)</label>
                                    <input type="text" maxLength="6" id="maxRedemptionsPerUser" value={customRewards.redemptionPerUser} className={styles.inputBox} onChange={(event)=>this.props.setInputValue(event, 'redemptionPerUser', badgeNum)}/>
                                </div>
                            </div>
                            : null
                        }
                        
                        {this.props.alert ? <div className={styles.alert}>*Please fill in the required fields*<img src="https://cdn.betterttv.net/emote/59f27b3f4ebd8047f54dee29/1x" alt="emote"/></div> : null}
                        <button className={styles.saveButton} onClick={(event)=>{
                            this.props.submitForm(event, this.props.badgeNum)
                            }}>save</button>

                    </form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        customRewards: state.channelPointReducer.customRewards,
        displayForm: state.channelPointReducer.displayForm
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateDescCharCount: (event, badgeNum) => dispatch({type: 'UPDATE_DESC_CHAR_COUNT', payload: {event, badgeNum}}),
        handleColorChangeComplete: (color, badgeNum) => dispatch({type: 'HANDLE_COLOR_CHANGE_COMPLETE', payload: {color, badgeNum}}),
        toggleColorSelect: (status, badgeNum) => dispatch({type: 'TOGGLE_COLOR_SELECT', payload: {status, badgeNum}}),
        showCustomPicker: (status, badgeNum) => dispatch({type: 'SHOW_CUSTOM_PICKER', payload: {status, badgeNum}}),
        toggleHandler: (status, option, badgeNum) => dispatch({type: 'TOGGLE_HANDLER', payload: {status, option, badgeNum}}),
        onSelect: (option, badgeNum) => dispatch({type: 'ON_SELECT', payload: {option, badgeNum}}),
        setInputValue: (event, input, badgeNum) => dispatch({type: 'SET_INPUT_VALUE', payload: {event, input, badgeNum}}),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form)