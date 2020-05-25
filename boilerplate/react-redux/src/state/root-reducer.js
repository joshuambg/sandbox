import actions from './actions';

const reducer = (state, action) => {
    switch (action.type) {
        case actions.UPDATE_MESSAGE:
            return { ...state, message: action.payload }
      default:
        console.error(`No reducer for action type ${action.type} found.`);
            return state
    }
}

export default reducer;