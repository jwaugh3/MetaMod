import * as actionTypes from '../actions';

const initialState = {
    modLogs: []
}

const reducer = (state = initialState, action) => {

    switch(action.type){
        case actionTypes.SET_MOD_LOGS:
            return {
                ...state,
                modLogs: action.payload
            }
        default:
            return {
                ...state
            }
    }
}

export default reducer