import * as actionTypes from '../actions';

const initialState = {
    modLogs: []
}

const reducer = (state = initialState, action) => {

    switch(action.type){
        case actionTypes.SET_MOD_LOGS:
            console.log(action.payload)
            return {
                modLogs: action.payload
            }
    }
    return state
}

export default reducer