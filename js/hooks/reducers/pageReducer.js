import actions from '../actions/pageActions'
import { PAGE_STATUS } from '../../data/status'

const isPageStatus = (pageStatus, status) => (
  pageStatus && pageStatus.name === status.name
)
export default (state, action) => {
  switch (action.type) {
    case actions.SET_STATUS:
      return {
        ...state,
        pageStatus: action.payload,
      }
    case actions.PRESS_SHORTCUT:
      return {
        ...state,
        shortcutKey: action.payload,
        shortcutActionTimestamp: Date.now(),
      }
    case actions.LOAD_PAGEDATA:
      return {
        ...state,
        pageData: {
          ...action.payload,
          loadTime: Date.now(),
        },
        pageStatus: PAGE_STATUS.READY,
      }
    case actions.SET_PAGEDATA:
      return {
        ...state,
        pageData: action.payload || {},
      }
    case actions.PANEL_TOGGLE:
      return {
        ...state,
        extraClass: (!state.showPanel && action.payload.isBigger) ? 'mnm-sidepanel-container--opened' : '',
        showPanel: !state.showPanel,
      }
    case actions.SET_PANEL_CONTENT:
      return {
        ...state,
        panelTitle: action.payload.title,
        panelContent: action.payload.content,
      }
    default:
      break
  }
  return state
}
