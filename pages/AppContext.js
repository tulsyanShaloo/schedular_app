import { createContext, useReducer, useEffect } from 'react'
import eventReducer, { initialState } from './reducer'

export const AppContext = createContext({
  state: initialState,
  dispatch: () => null,
})

const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(eventReducer, initialState)

  //checking if localStorage has existing values and if true then dispatching an action to add the events to our state
  useEffect(() => {
    const storedEvents = localStorage.getItem('events')
    if (storedEvents) {
      dispatch({ type: 'ADD_EVENT', payload: JSON.parse(storedEvents) })
    }
  }, [])

  const addEvent = (event) => {
    const updatedEvents = [...state.events, event]

    dispatch({ type: 'ADD_EVENT', payload: updatedEvents })
    localStorage.setItem('events', JSON.stringify(updatedEvents))
  }

  return (
    <AppContext.Provider value={{ state, dispatch, addEvent }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider
