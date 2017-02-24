/* eslint-env browser */
import {generate as generateId} from 'shortid';

export default function tagsReducer(state = [], action) {
  if (action.type === 'ADD_TAG') {
    const tag = Object.assign({id: generateId()}, action.payload);
    return [].concat(state).concat([tag]);
  }
  return state;
}
