import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Opponent from './Opponent';
import WhoseTurn from './WhoseTurn';
import RollBtn from './RollBtn';
import RolledDice from './RolledDice';
import Winner from './Winner';
import channel from './channel';

const Subheader = withRouter(({ game, playerColor, history }) => {
  function isYourTurn() {
    return game.whose_turn == playerColor && !game.winner;
  }

  function reset() {
    history.push('/');
  }

  return game ? (
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
      <Winner winner={game.winner} playerColor={playerColor} reset={reset} />
    </div>
  ) : (
    <span />
  );
});

function state2props(state) {
  return {
    game: state.game,
    playerColor: state.playerColor
  };
}

export default connect(state2props)(Subheader);
