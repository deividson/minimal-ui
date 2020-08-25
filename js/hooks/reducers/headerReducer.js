import actions from '../actions/headerActions'

export default (state, action) => {
  switch (action.type) {
    case actions.UPDATE_HEADER:
      return {
        ...state,
        ...action.payload,
      }
    default:
      break
  }
  return state
}
