import { h, createContext } from 'preact'
import { useReducer } from 'preact/hooks'
import headerReducer from '../reducers/headerReducer'

const titleBase = 'DevTools'

const initialState = {
  title: titleBase,
  toolbar: { key: '', buttons: [] },
  headerStatus: { name: 'ready', icon: '' },
}
const HeaderContext = createContext(initialState)

const HeaderProvider = ({ children }) => {
  const [headerState, dispatch] = useReducer(headerReducer, initialState)

  return (
    <HeaderContext.Provider value={{ headerState, dispatch }}>
      {children}
    </HeaderContext.Provider>
  )
}

export { HeaderContext, HeaderProvider }
