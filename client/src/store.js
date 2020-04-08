import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

const middlewareState = [thunk]

const inittialState = {}

const store = createStore(
  rootReducer,
  inittialState,
  compose(
    applyMiddleware(...middlewareState),
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()) || compose
  )
)

export default store