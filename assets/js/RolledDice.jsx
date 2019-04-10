import React from 'react';
import { connect } from 'react-redux';
import Filler from './Filler';
import Die from './Die';

const RolledDice = ({ game, isYourTurn }) => {
  let dice = game.current_dice;

  let roll = <Filler />;
  if (dice.length > 0 && isYourTurn) {
    roll = (
      <span>
        Your roll: <Die roll={dice} />
      </span>
    );
  } else if (dice.length > 0) {
    roll = (
      <span>
        Your opponent's roll: <Die roll={dice} />
      </span>
    );
  }
  return roll;
};

function state2props(state) {
  return {
    game: state.game
  };
}

export default connect(state2props)(RolledDice);
