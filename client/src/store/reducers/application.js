import * as actionTypes from '../actions';

const initialState = {
    username: '',
    login_username: '',
    twitchID: '',
    profileImage: '',
    modList: [],
    channelAccess: [],
    channelHistory: [],
    roomUsers: [],
    accessToken: '',
    currentChannel: '',
    activeTab: 'Dashboard',
    channelPointsReceived: false
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        //set username
        case actionTypes.SET_USERNAME:
            return {
                ...state,
                username: action.payload
            }
        //set login username
        case actionTypes.SET_LOGIN_USERNAME:
            return {
                ...state,
                login_username: action.payload
            }
        case actionTypes.SET_TWITCH_ID:
            return {
                ...state,
                twitchID: action.payload
            }
        case actionTypes.SET_PROFILE_IMAGE:
            return {
                ...state,
                profileImage: action.payload
            }
        case actionTypes.SET_MOD_LIST:
            return {
                ...state,
                modList: action.payload
            }
        case actionTypes.SET_CHANNEL_ACCESS:
            return {
                ...state,
                channelAccess: action.payload
            }
        case actionTypes.ADD_CHANNEL_HISTORY:
            return {
                ...state,
                channelHistory: [...state.channelHistory, action.payload]
            }
        case actionTypes.SET_ROOM_USERS:
            return {
                ...state,
                roomUsers: action.payload
            }
        case actionTypes.SET_ACCESS_TOKEN:
            return {
                ...state,
                accessToken: action.payload
            }

        //set the current channel user is in
        case actionTypes.SET_CURRENT_CHANNEL:
            return {
              ...state,
              currentChannel: action.payload
            }
        case actionTypes.SET_ACTIVE_TAB:
            return {
                ...state,
                activeTab: action.payload
            }
        case actionTypes.SET_CHANNEL_POINTS_RECEIVED:
            return {
                ...state,
                channelPointsReceived: action.payload
            }
        default:
            return {
                ...state
            }
    }
}

export default reducer