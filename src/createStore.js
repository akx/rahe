/* eslint-env browser */
import {compose, createStore, combineReducers} from 'redux';
import persistState, {mergePersistedState} from 'redux-localstorage';
import adapter from 'redux-localstorage/lib/adapters/localStorage';
import R from 'ramda';
import {notification} from 'antd';

const transactionsReducer = (state = [], action) => {
  if (action.type === 'ADD_TRANSACTIONS') {
    const currentTxnIds = new Set(R.pluck('id', state));
    const txnsToAdd = action.payload.filter((txn) => !currentTxnIds.has(txn.id));
    const newTxns = R.sortBy(R.prop('id'), state.concat(txnsToAdd));

    notification.success({
      message: 'Transaction data saved',
      description: `${txnsToAdd.length} new transactions; ${newTxns.length} total transactions.`,
    });
    return newTxns;
  }
  return state;
};
const rootReducer = combineReducers({
  transactions: transactionsReducer,
});


export default function () {
  const reducer = compose(
    mergePersistedState()
  )(rootReducer);

  const storage = adapter(window.localStorage);

  const enhancer = compose(
    /* applyMiddleware(...middlewares) */
    persistState(storage, 'rahe')
  );
  return createStore(reducer, enhancer);
}
