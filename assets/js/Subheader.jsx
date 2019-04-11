import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Opponent from './Opponent';
import WhoseTurn from './WhoseTurn';
import RollBtn from './RollBtn';
import RolledDice from './RolledDice';
import Winner from './Winner';
import channel from './channel';
import store from './store';
import api from './api';

const Subheader = withRouter(
  ({ game, playerColor, history, location, session }) => {
    function isYourTurn() {
      return game.whose_turn == playerColor && !game.winner;
    }

    function reset() {
      store.dispatch({
        type: 'NEW_HAS_WON',
        data: false
      });
      channel.socketChannel.push('reset');
      api.get_leaders();
      let id = session.user_id || session.id;
      api.get_fresh_session(id);
      history.push('/');
    }

    let title = session ? (
      <h1>
        Hi {session.username}! You are in game lobby:{' '}
        {location.pathname.replace('/game/', '')}
      </h1>
    ) : (
      <span />
    );

    return game ? (
      <div>
        {title}
        <div className="subheader-wrapper">
          <span>You are {playerColor}</span>
          <Opponent players={Object.keys(game.players)} />
          <WhoseTurn isYourTurn={isYourTurn()} isGameOver={game.winner} />
          <RollBtn
            showBtn={game.current_dice.length == 0 && isYourTurn()}
            getRoll={() => {
              channel.socketChannel.push('roll');
            }}
          />
          <RolledDice isYourTurn={isYourTurn()} />
          <Winner
            winner={game.winner}
            playerColor={playerColor}
            reset={reset}
          />
        </div>
      </div>
    ) : (
      <span />
    );
  }
);

function state2props(state) {
  return {
    game: state.game,
    playerColor: state.playerColor,
    session: state.session
  };
}

export default connect(state2props)(Subheader);
