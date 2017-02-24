/* eslint-env browser */
import R from 'ramda';
import {notification} from 'antd';

export default function transactionsReducer(state = [], action) {
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
}
