import { createStore, combineReducers } from 'redux';
import deepFreeze from 'deep-freeze';

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

function game(state = null, action) {
  switch (action.type) {
    case 'NEW_GAME':
      return action.data;
    default:
      return state;
  }
}

function playerColor(state = null, action) {
  switch (action.type) {
    case 'NEW_PLAYER_COLOR':
      return action.data;
    default:
      return state;
  }
}


function selectedSlot(state = null, action) {
  switch (action.type) {
    case 'NEW_SELECTED_SLOT':
      return action.data;
    default:
      return state;
  }
}

function highlightedSlots(state = [], action) {
  switch (action.type) {
    case 'NEW_HIGHLIGHTED_SLOTS':
      return action.data;
    default:
      return state;
  }
}


function root_reducer(state0, action) {
  let reducer = combineReducers({
    session,
    game,
    playerColor,
    selectedSlot,
    highlightedSlots
  });

  let state1 = reducer(state0, action);

  return deepFreeze(state1);
}

let store = createStore(root_reducer);
export default store;
