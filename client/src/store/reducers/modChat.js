import * as actionTypes from '../actions';

const initialState = {
    modMsgs: [],
    modChatEnabled: true
}

const reducer = (state = initialState, action) => {

    switch(action.type){
        //add new mod msg
        case actionTypes.NEW_MOD_MSG:
            return {
                ...state,
                modMsgs: state.modMsgs.concat(action.payload)
            }
        //clear all mod messages
        case actionTypes.CLEAR_MOD_MSGS:
            return {
                ...state,
                modMsgs: []
            }
        //toggle mod chat view
        case actionTypes.TOGGLE_MOD_CHAT_VIEW:
            return {
                ...state,
                modChatEnabled: action.payload
            }
        default:
            return {
                ...state
            }
    }
}

export default reducer