const { createCustomReward, getCustomReward, updateCustomReward } = require('../../../api/apiCall')


export const getCustomRewardHandler = async (apiEndpoint, currentChannel, createReward) => {
    await getCustomReward(apiEndpoint, currentChannel).then((existingRewards)=>{
        
        if(existingRewards !== 'error'){

            if(existingRewards[0].data.length !== 0 || existingRewards[1].length !== 0){
                for(let x=0; x < 2; x++){
                    existingRewards[x].data.forEach((existingReward) => {
                    
                        let reward = {
                            rewardName: existingReward.title,
                            rewardID: existingReward.id,
                            cost: existingReward.cost,
                            description: existingReward.prompt,
                            //color picker
                            backgroundColor: existingReward.background_color,
                            colorSelect: ['#05A1E5', '#8B35D8', '#00FF7F', '#FF0811', '#353435', '#73C2E4', '#B78BDD', '#71F1B1', '#F17579', '#8B8B8B'],
                            displayPicker: false,
                            showCustomizer: false,
                            viewerInputRequired: existingReward.is_user_input_required,
                            addRedemption: !existingReward.should_redemptions_skip_request_queue,
                            cooldown: existingReward.global_cooldown_setting.is_enabled,
                            redemptionCooldownTimeLabel: 'seconds',
                            redemptionCooldownTime: existingReward.global_cooldown_setting.global_cooldown_seconds,
                            redemptionPerStream: existingReward.max_per_stream_setting.max_per_stream,
                            redemptionPerUser: existingReward.max_per_user_per_stream_setting.max_per_user_per_stream,
                            isEnabled: existingReward.is_enabled,
                            isManageable: x === 0 ? true : false
                        }

                        createReward(reward)
                    });
                }
            }  
        }
    })
    
    return true
}

export const createRewardOnTwitch = async (apiEndpoint, currentChannel, setNewRewardID, customRewards, deleteFailedReward, setChannelPointAlert, badgeNum) => {
    let formData = customRewards[badgeNum]

    let cooldownTime
    if(formData.redemptionCooldownTimeLabel === 'seconds'){
        cooldownTime = formData.redemptionCooldownTime
    } else if( formData.redemptionCooldownTimeLabel === 'minutes'){
        cooldownTime = formData.redemptionCooldownTime * 60
    } else if(formData.redemptionCooldownTimeLabel === 'hours'){
        cooldownTime = formData.redemptionCooldownTime * 60 * 60
    }
    let backgroundColor = formData.backgroundColor.toUpperCase()
    
    let rewardDataSend = {
        title: formData.rewardName,
        prompt: formData.description,
        cost: formData.cost,
        is_enabled: formData.isEnabled,
        background_color: backgroundColor,
        is_user_input_required: formData.viewerInputRequired,
        is_max_per_user_per_stream_enabled: formData.redemptionPerStream === '' ? false : true,
        is_global_cooldown_enabled: formData.cooldown,
        global_cooldown_seconds: cooldownTime,
        should_redemptions_skip_request_queue: !formData.addRedemption
    }

    if(formData.redemptionPerStream !== ''){
        rewardDataSend.max_per_stream = formData.redemptionPerStream
    }
    if(formData.redemptionPerUser !== ''){
        rewardDataSend.max_per_user_per_stream = formData.redemptionPerUser
    }

    if(formData.rewardID === ''){
        //create
        await createCustomReward(apiEndpoint, currentChannel, rewardDataSend).then((data)=>{
            let resData = JSON.parse(data.response.body)
            if(resData.message === 'CREATE_CUSTOM_REWARD_DUPLICATE_REWARD'){
                //if error occurs when attempting create a duplicate reward
                deleteFailedReward()
                setChannelPointAlert('Trying to make a duplicate reward? ...Not on my watch ')
                setTimeout(()=>{
                    setChannelPointAlert('')
                }, 6000)
                return
            } else if(resData.error){
                //if error occurs when attempting create a duplicate reward
                deleteFailedReward()
                setChannelPointAlert('Umm.. yeah.. there was an issue with that reward ')
                setTimeout(()=>{
                    setChannelPointAlert('')
                }, 6000)
                return
            } else {
                let newReward = {
                    rewardName: resData.data[0].title,
                    rewardID: resData.data[0].id,
                    cost: resData.data[0].cost,
                    description: resData.data[0].prompt,
                    //color picker
                    backgroundColor: resData.data[0].background_color,
                    colorSelect: ['#05A1E5', '#8B35D8', '#00FF7F', '#FF0811', '#353435', '#73C2E4', '#B78BDD', '#71F1B1', '#F17579', '#8B8B8B'],
                    displayPicker: false,
                    showCustomizer: false,
                    viewerInputRequired: resData.data[0].is_user_input_required,
                    addRedemption: !resData.data[0].should_redemptions_skip_request_queue,
                    cooldown: resData.data[0].global_cooldown_setting.is_enabled,
                    redemptionCooldownTimeLabel: 'seconds',
                    redemptionCooldownTime: resData.data[0].global_cooldown_setting.global_cooldown_seconds,
                    redemptionPerStream: resData.data[0].max_per_stream_setting.max_per_stream,
                    redemptionPerUser: resData.data[0].max_per_user_per_stream_setting.max_per_user_per_stream,
                    isEnabled: resData.data[0].is_enabled,
                    isManageable: true
                }

                setNewRewardID(newReward)
            }
        })
    } else {
        //update
        await updateCustomReward(apiEndpoint, currentChannel, formData.rewardID, rewardDataSend)
    }
}