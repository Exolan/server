import { configureStore } from "@reduxjs/toolkit";

const defState = {
    selectedOption: 0
}

const reducer = (state = defState, action) => {
    switch (action.type){
        case 'SET_OPTION':
            return{...state, selectedOption: action.payload}
        case 'SET_TABLE':
            return{...state, selectedTable: action.payload}
        default:
            return state
    }
}

export default configureStore({reducer: reducer})