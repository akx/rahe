/* eslint-env browser */

const DEFAULT_STATE = {
  view: 'welcome',
};

export default function appReducer(state = DEFAULT_STATE, action) {
  if (action.type === 'NAVIGATE_MAIN') {
    return Object.assign({}, state, {view: action.payload});
  }
  return state;
}
