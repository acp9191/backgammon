import React from 'react';
import { connect } from 'react-redux';

const Opponent = ({ game, session }) => {
  let opponent = <span />;
  if (game && session) {
    let players = Object.keys(game.players);
    if (players.length < 2) {
      opponent = <span>Waiting for opponent to join</span>;
    } else {
      let name = players.filter(player => {
        return player != session.username;
      })[0];
      opponent = <span>Your opponent is: {name}</span>;
    }
  }
  return opponent;
};

function state2props(state) {
  return {
    game: state.game,
    session: state.session
  };
}

export default connect(state2props)(Opponent);
