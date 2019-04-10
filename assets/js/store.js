import { createStore, combineReducers } from 'redux';
import deepFreeze from 'deep-freeze';

function user(state = null, action) {
  switch (action.type) {
    default:
      return state;
  }
}

function session(state = null, action) {
  switch (action.type) {
    case 'NEW_SESSION':
      return action.data;
    case 'LOGOUT_SESSION':
      return null;
    default:
      return state;
  }
}

function channel(state = null, action) {
  switch (action.type) {
    case 'NEW_CHANNEL':
      return action.data;
    default:
      return state;
  }
}

function game(state = null, action) {
  switch (action.type) {
    case 'NEW_GAME':
      return action.data;
    default:
      return state;
  }
}


function root_reducer(state0, action) {
  let reducer = combineReducers({
    user,
    session,
    channel,
    game
  });

  let state1 = reducer(state0, action);

  console.log(state1)

  return deepFreeze(state1);
}

let store = createStore(root_reducer);
export default store;
