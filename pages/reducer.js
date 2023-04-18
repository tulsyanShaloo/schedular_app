export const initialState = {
  events: [],
}

const eventReducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case 'ADD_EVENT':
      return { ...state, events: payload }
    default:
      return state
  }
}

export default eventReducer
