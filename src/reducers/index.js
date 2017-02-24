import {combineReducers} from 'redux';
import transactions from './transactions';
import tags from './tags';
import app from './app';

export default combineReducers({
  transactions,
  tags,
  app,
});
