import { h, Fragment } from 'preact'
import {
  useEffect, useReducer, useContext,
} from 'preact/hooks'

import { HeaderContext } from '../hooks/context/headerContext'
import pageReducer from '../hooks/reducers/pageReducer'
import actions from '../hooks/actions/pageActions'
import headerActions from '../hooks/actions/headerActions'

import { PAGE_STATUS } from '../data/status'
import SidePanel from './SidePanel'

let indexedDB
const utilsPromise = import('../../../utils')
utilsPromise.then((utils) => {
  indexedDB = utils.indexedDB
})

let sendScreenView
const analyticsPromise = import('../../../analytics')
analyticsPromise.then((analytics) => {
  sendScreenView = analytics.ga.sendScreenView
})

const gaSendScreenView = (pageName) => {
  utilsPromise.then((analytics) => {
    sendScreenView(pageName)
  })
}

const PANEL_WIDTH = 350

const isPageStatus = (pageStatus, status) => (
  pageStatus && pageStatus.name === status.name
)

const pageHoc = (WrappedComponent, pageIdProp) => (
  (props) => {
    const initialState = {
      pageID: pageIdProp,
      pageStatus: PAGE_STATUS.LOADING,
      pageData: undefined,
      showPanel: false,
      panelTitle: '',
      panelContent: '',
      extraClass: '',
    }

    let shortcutMap
    let contentWidth

    const headerContext = useContext(HeaderContext)
    const headerDispatch = headerContext.dispatch

    const [pageState, dispatch] = useReducer(pageReducer, initialState)
    const {
      pageID, shortcutKey, shortcutActionTimestamp,
      pageData, pageStatus,
      showPanel, panelTitle, panelContent,
      extraClass,
    } = pageState

    const dispatchPageAct = (actionType, payload) => {
      dispatch({ type: actionType, payload })
    }

    const setupPage = async (viewState = {}, callbacks = {}) => {
      shortcutMap = viewState.SHORTCUTS_MAP
      const initialPageData = viewState.initialPageData || {}

      gaSendScreenView(viewState.pageName)

      await utilsPromise

      indexedDB.getPageData(pageID).then((res) => {
        dispatchPageAct(actions.LOAD_PAGEDATA, {
          ...initialPageData,
          ...res,
        })
      })
    }

    const onChangePageData = async (viewState) => {
      await utilsPromise

      indexedDB.updatePageData(pageID, viewState)
      dispatchPageAct(actions.LOAD_PAGEDATA, viewState)
    }

    const setPageStatus = (status, options = {}) => {
      let toStatus = status
      if (options.ifEqual) {
        toStatus = isPageStatus(pageStatus, status) ? options.ifEqual : status
      }

      dispatchPageAct(actions.SET_STATUS, toStatus)
    }

    const onKeyUp = (ev) => {
      if (!shortcutMap) {
        return
      }

      if (((ev.ctrlKey || ev.metaKey) && shortcutMap.CTRL && shortcutMap.CTRL.includes(ev.key))
        || shortcutMap.KEY.includes(ev.key)) {
        dispatchPageAct(actions.PRESS_SHORTCUT, ev.key)
        ev.preventDefault()
      }
    }

    const refreshHeader = (_pageStatus, headerInfo) => {
      headerDispatch({
        type: headerActions.UPDATE_HEADER,
        payload: {
          title: headerInfo.title,
          toolbar: {
            key: `toolbar__${pageID}`,
            buttons: headerInfo.buttons || [],
          },
          secondaryField: headerInfo.secondaryField,
          status: _pageStatus,
        },
      })
    }

    const setPanelContent = (title, content) => {
      dispatchPageAct(actions.SET_PANEL_CONTENT, {
        title,
        content,
      })
    }

    const onTogglePanel = () => {
      const isBigger = contentWidth >= (window.innerWidth - PANEL_WIDTH)
      dispatchPageAct(actions.PANEL_TOGGLE, { isBigger })
    }

    // did mount
    useEffect(() => {
      document.addEventListener('keydown', onKeyUp)

      return () => {
        document.removeEventListener('keydown', onKeyUp)
      }
    }, [])

    const refChild = (rf) => {
      if (rf) {
        contentWidth = (rf || {}).base.offsetWidth
      }
    }

    return (
      <Fragment>
        <WrappedComponent
          ref={refChild}
          {...props}
          setPageStatus={setPageStatus}
          onEnterPage={setupPage}
          setPageData={onChangePageData}
          shortcutKey={shortcutKey}
          shortcutActionTimestamp={shortcutActionTimestamp}
          pageData={pageData}
          pageStatus={pageStatus}
          refreshPageHeader={refreshHeader}
          setPanelContent={setPanelContent}
          togglePanel={onTogglePanel}
          extraClasses={extraClass}
          panelOpened={showPanel}
        />
        <SidePanel title={panelTitle} opened={showPanel}>
          {panelContent}
        </SidePanel>
      </Fragment>
    )
  }
)

export default pageHoc
