import React from 'react';
import Row from './Row';
import Subheader from './Subheader';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import store from './store';
import channel from './channel';
import { Launcher } from 'react-chat-window';
import api from './api';

const Backgammon = ({
  game,
  session,
  playerColor,
  selectedSlot,
  hasWon
}) => {
  let firstTwelveSlots, lastTwelveSlots, topSlots, bottomSlots, topColor;

  if (game && game.winner && !hasWon && session) {
    let id = session.id || session.user_id;
    api.get_fresh_session(id);
  }

  function isAllowedToMove() {
    return game.whose_turn == playerColor;
  }

  function getTd(td) {
    return td.tagName == 'svg' || td.tagName == 'rect' ? td.parentNode : td;
  }

  function getMoveTaken(moveTo) {
    return game.possible_moves.filter(
      move => move.from == selectedSlot && move.to == moveTo
    )[0];
  }

  function moveAndClearSlot(moveTaken) {
    if (moveTaken) {
      channel.socketChannel.push('move', {
        move: moveTaken
      });
    }
    store.dispatch({
      type: 'NEW_SELECTED_SLOT',
      data: null
    });

    store.dispatch({
      type: 'NEW_HIGHLIGHTED_SLOTS',
      data: []
    });
  }

  function isHighlighted(td) {
    return td.classList.contains('highlighted');
  }

  function moveHome(e) {
    if (isAllowedToMove()) {
      let td = getTd(getTd(e.target));
      if (isHighlighted(td)) {
        moveAndClearSlot(getMoveTaken('home'));
      }
    }
  }

  function makeMove(e) {
    if (isAllowedToMove()) {
      let td = getTd(e.target.parentNode);
      if (isHighlighted(td)) {
        moveAndClearSlot(getMoveTaken(td.dataset.index));
      }
    }
  }

  function moveIn() {
    if (isAllowedToMove()) {
      let moves = [];
      for (let i = 0; i < game.possible_moves.length; i++) {
        moves.push(game.possible_moves[i].to);
      }

      store.dispatch({
        type: 'NEW_SELECTED_SLOT',
        data: 'knocked'
      });

      store.dispatch({
        type: 'NEW_HIGHLIGHTED_SLOTS',
        data: moves
      });
    }
  }

  function selectSlot(e) {
    if (isAllowedToMove() && game.current_dice.length > 0) {
      let td = getTd(e.target.parentNode);
      let idx = td.dataset.index;

      if (td.classList.contains(playerColor)) {
        if (selectedSlot == idx) {
          moveAndClearSlot(null);
        } else {
          let moves = [];
          for (let i = 0; i < game.possible_moves.length; i++) {
            let move = game.possible_moves[i];

            if (move.from == idx) {
              let dest = move.to == 'home' ? 'home-' + playerColor : move.to;
              moves.push(dest);
            }
          }
          store.dispatch({
            type: 'NEW_SELECTED_SLOT',
            data: idx
          });
          store.dispatch({
            type: 'NEW_HIGHLIGHTED_SLOTS',
            data: moves
          });
        }
      }
    }
  }

  function onMessageWasSent(chat) {
    chat.author = playerColor;
    channel.socketChannel.push('chat', { chat: chat });
  }

  if (game) {
    firstTwelveSlots = game.slots.slice(0, 12).reverse();
    lastTwelveSlots = game.slots.slice(12, 24);

    topSlots = playerColor == 'white' ? firstTwelveSlots : lastTwelveSlots;
    bottomSlots = playerColor == 'white' ? lastTwelveSlots : firstTwelveSlots;

    topColor = playerColor == 'white' ? 'red' : 'white';
  }

  let rows = game ? (
    <tbody>
      <Row
        isTop={true}
        color={topColor}
        handler={selectSlot}
        moveHandler={makeMove}
        moveHomeHandler={moveHome}
        homeCount={game.home[topColor]}
        knockedCount={game.knocked[topColor]}
        slots={topSlots}
      />
      <Row
        isTop={false}
        color={playerColor}
        handler={selectSlot}
        moveHandler={makeMove}
        moveHomeHandler={moveHome}
        moveInHandler={moveIn}
        homeCount={game.home[playerColor]}
        knockedCount={game.knocked[playerColor]}
        slots={bottomSlots}
      />
    </tbody>
  ) : (
    <tbody />
  );

  let gameDisplay = (
    <div>
      <Subheader playerColor={playerColor} />
      <table>{rows}</table>
    </div>
  );

  return gameDisplay;
};
function state2props(state) {
  return {
    game: state.game,
    session: state.session,
    playerColor: state.playerColor,
    selectedSlot: state.selectedSlot,
    highlightedSlots: state.highlightedSlots,
    hasWon: state.hasWon
  };
}

export default connect(state2props)(Backgammon);
