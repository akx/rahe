/* eslint-env browser */
import {generate as generateId} from 'shortid';
import update from 'immutability-helper';

export default function tagsReducer(state = [], action) {
  if (action.type === 'ADD_TAG') {
    const tag = Object.assign({id: generateId()}, action.payload);
    return update(state, {$push: [tag]});
  }
  if (action.type === 'UPDATE_TAG') {
    const newTag = action.payload;
    const {id} = newTag;
    return state.map((tag) => {
      if (tag.id !== id) return tag;
      return Object.assign({}, newTag);
    });
  }
  if (action.type === 'DELETE_TAG') {
    const {id} = action.payload;
    return state.filter((tag) => (tag.id !== id));
  }
  return state;
}
