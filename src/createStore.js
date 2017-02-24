/* eslint-env browser */
import {compose, createStore} from 'redux';
import persistState, {mergePersistedState} from 'redux-localstorage';
import adapter from 'redux-localstorage/lib/adapters/localStorage';
import rootReducer from './reducers';


export default function () {
  const reducer = compose(
    mergePersistedState()
  )(rootReducer);

  const storage = adapter(window.localStorage);
  // eslint-disable-next-line no-underscore-dangle
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const enhancer = composeEnhancers(
    /* applyMiddleware(...middlewares) */
    persistState(storage, 'rahe')
  );
  return createStore(reducer, enhancer);
}
