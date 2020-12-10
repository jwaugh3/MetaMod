import * as actionTypes from '../actions';

const initialState = {
    twitchChatCount: 1,
    twitchMessages: [],
    channelEmotes: [],
    channelEmoteCodes: [],
    channelEmoteIDByName: [],
    moduleSettings: [ { moduleName: '', settingsDisplay: false, editModuleName: false, paused: false, commands: true, nonsubscribers: true, subscribers: true, directChat: true, emotes: true, modMsgs: true } ]
}

const reducer = (state = initialState, action) => {

    switch(action.type){

    //-------------------------twitch messages
        //add new twitch message
        case actionTypes.ADD_TWITCH_MESSAGE:
            var newTwitchMessages = [...state.twitchMessages]
            if(newTwitchMessages.length < 200){
              newTwitchMessages = state.twitchMessages.concat(action.payload)
            } else {
              newTwitchMessages = [...state.twitchMessages.slice(1), action.payload]
            }
      
            return {
              ...state,
              twitchMessages: newTwitchMessages
            }
        //clear twitch messages
        case actionTypes.CLEAR_TWITCH_MESSAGES:
            return {
                ...state,
                twitchMessages: []
            }

    //-------------------------channel emotes
        //add channel emotes
        case actionTypes.ADD_CHANNEL_EMOTES:
            return {
                ...state,
                channelEmotes: action.payload
            }
        //add channel emote codes
        case actionTypes.ADD_CHANNEL_EMOTE_CODES:
            return {
                ...state,
                channelEmoteCodes: action.payload
            }
        //add channel emote id by name
        case actionTypes.ADD_CHANNEL_EMOTE_ID_BY_NAME:
            return {
                ...state,
                channelEmoteIDByName: action.payload
            }

    //-------------------------module settings
        //increase chat count
        case actionTypes.INCREASE_CHAT_MODULE_COUNT:
            return {
                ...state,
                twitchChatCount: action.payload + 1
            }
        //decrease chat count
        case actionTypes.DECREASE_CHAT_MODULE_COUNT:
            return {
                ...state,
                twitchChatCount: action.payload - 1
            }
        //add twitch module
        case actionTypes.ADD_TWITCH_CHAT_MODULE:
            let newModuleSettings = { moduleName: '', settingsDisplay: false, editModuleName: false, paused: false, commands: true, nonsubscribers: true, subscribers: true, directChat: true, emotes: true, modMsgs: true }
            return {
                ...state,
                moduleSettings: [...state.moduleSettings, newModuleSettings]
            }
        //toggle visibility of settings for specific module
        case actionTypes.TOGGLE_SETTINGS_VIEW:
            let newSettings = [...state.moduleSettings]
            newSettings[action.payload.moduleNum].settingsDisplay = action.payload.status
            return {
                ...state,
                moduleSettings: newSettings
            }
        //remove specific module
        case actionTypes.REMOVE_CHAT_MODULE:
            let removeChatSettings = [...state.moduleSettings]
            removeChatSettings.splice(action.payload, 1)
            return {
                ...state,
                moduleSettings: removeChatSettings
            }
        //toggle editable name for specific module
        case actionTypes.TOGGLE_EDIT_NAME:
            let updatedNameSettings = [...state.moduleSettings]
            updatedNameSettings[action.payload.moduleNum].editModuleName = action.payload.status
            return {
                ...state,
                moduleSettings: updatedNameSettings
            }
        //receive and store input of specific module name
        case actionTypes.SET_MODULE_NAME:
            let setNameSettings = [...state.moduleSettings]
            setNameSettings[action.payload.moduleNum].moduleName = action.payload.moduleName
            return {
                ...state,
                moduleSettings: setNameSettings
            }
        //pause chat for specific module
        case actionTypes.PAUSE_CHAT_MODULE:
            let updatedPausedState = [...state.moduleSettings]
            updatedPausedState[action.payload.moduleNum].paused = action.payload.status
            return {
                ...state,
                moduleSettings: updatedPausedState
            }
        
    //-------------------------chat filter settings
        //update visibility of commands for specific module
        case actionTypes.UPDATE_FILTER_COMMANDS:
            let commandSettings = [...state.moduleSettings]
            commandSettings[action.payload.moduleNum].commands = !action.payload.status
            return {
                ...state,
                moduleSettings: commandSettings
            }
        case actionTypes.UPDATE_FILTER_SUBSCRIBER_MESSAGES:
            let subscriberSettings = [...state.moduleSettings]
            subscriberSettings[action.payload.moduleNum].subscribers = !action.payload.status
            return {
                ...state,
                moduleSettings: subscriberSettings
            }
        case actionTypes.UPDATE_FILTER_NONSUBSCRIBER_MESSAGES:
            let nonsubscriberSettings = [...state.moduleSettings]
            nonsubscriberSettings[action.payload.moduleNum].nonsubscribers = !action.payload.status
            return {
                ...state,
                moduleSettings: nonsubscriberSettings
            }
        case actionTypes.UPDATE_FILTER_DIRECT_MENTIONS:
            let directMentionSettings = [...state.moduleSettings]
            directMentionSettings[action.payload.moduleNum].directChat = !action.payload.status
            return {
                ...state,
                moduleSettings: directMentionSettings
            }
        case actionTypes.UPDATE_FILTER_EMOTES:
            let emoteSettings = [...state.moduleSettings]
            emoteSettings[action.payload.moduleNum].emotes = !action.payload.status
            return {
                ...state,
                moduleSettings: emoteSettings
            }
        case actionTypes.UPDATE_FILTER_MOD_MSGS:
            let modMsgsSettings = [...state.moduleSettings]
            modMsgsSettings[action.payload.moduleNum].modMsgs = !action.payload.status
            return {
                ...state,
                moduleSettings: modMsgsSettings
            }
        default:
            return {
                ...state
            }
    }
}

export default reducer