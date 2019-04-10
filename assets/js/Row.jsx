import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';

const Row = ({
  isTop,
  color,
  playerColor,
  selectedSlot,
  highlightedSlots,
  handler,
  moveHandler,
  moveHomeHandler,
  moveInHandler,
  homeCount,
  knockedCount,
  slots
}) => {
  function drawPieces(count, color, isTop, isHome) {
    const height = 250 / 15;
    const width = 50;
    const sideLength = 40;
    let svgs = [];

    for (let i = 0; i < count; i++) {
      let val = isHome ? i * height + 'px' : i * sideLength + 'px';
      let style = isTop ? { top: val } : { bottom: val };

      let svg = isHome ? (
        <svg key={i} height={height} width={width} style={style}>
          <rect
            height={height}
            width={width}
            stroke="black"
            strokeWidth="2"
            fill={color}
          />
        </svg>
      ) : (
        <svg key={i} height={sideLength} width={sideLength} style={style}>
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="black"
            strokeWidth="2"
            fill={color}
          />
        </svg>
      );
      svgs.push(svg);
    }

    return svgs;
  }

  function getSvgs(slot, isTop) {
    let svgs = [];
    if (slot.hasOwnProperty('num')) {
      svgs = drawPieces(slot.num, slot.owner, isTop, false);
    }
    return svgs;
  }

  function getHomePieces(count, color, isTop) {
    let svgs = [];
    if (count > 0) {
      svgs = drawPieces(count, color, isTop, true);
    }
    return svgs;
  }

  function getKnocked(count, color, isTop) {
    let svgs = [];
    if (count > 0) {
      svgs = drawPieces(count, color, isTop, false);
    }
    return svgs;
  }

  let isBlack = isTop ? false : true;

  let returnSlots = [];

  for (let i = 0; i < slots.length; i++) {
    let slot = slots[i];
    if (i == 6) {
      returnSlots.push(
        <td
          key={'knocked-' + color}
          onClick={moveInHandler}
          className="knocked"
        >
          {getKnocked(knockedCount, color, !isTop)}
        </td>
      );
    }
    let tdClasses = classNames(
      isBlack ? 'black' : '',
      slot.owner || '',
      slot.owner == playerColor ? 'clickable' : '',
      selectedSlot == slot.idx || highlightedSlots.includes(slot.idx)
        ? 'highlighted'
        : ''
    );
    let clickHandler = highlightedSlots.includes(slot.idx)
      ? moveHandler
      : handler;
    returnSlots.push(
      <td
        key={slot.idx}
        data-index={slot.idx}
        onClick={clickHandler}
        className={tdClasses}
      >
        <div className="triangle" />
        {getSvgs(slot, isTop)}
      </td>
    );
    isBlack = !isBlack;
  }

  let homeClasses = classNames(
    'home',
    highlightedSlots.includes('home-' + color) ? 'highlighted' : ''
  );

  returnSlots.push(
    <td onClick={moveHomeHandler} key={isTop} className={homeClasses}>
      {getHomePieces(homeCount, color, isTop)}
    </td>
  );

  let rowClass = isTop ? 'top' : 'bottom';

  return <tr className={rowClass}>{returnSlots}</tr>;
};

function state2props(state) {
  return {
    game: state.game,
    session: state.session,
    playerColor: state.playerColor,
    selectedSlot: state.selectedSlot,
    highlightedSlots: state.highlightedSlots
  };
}

export default connect(state2props)(Row);
