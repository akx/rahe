import {combineReducers} from 'redux';
import transactions from './transactions';
import tags from './tags';

export default combineReducers({
  transactions,
  tags,
});
