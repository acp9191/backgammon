import React, { Component } from 'react';
import classNames from 'classnames/bind';

export default class Row extends Component {
  constructor(props) {
    super(props);
  }

  getSvgs(slot, position) {
    let svgs = [];
    let sideLength = 40;

    if (slot.hasOwnProperty('num')) {
      for (let j = 0; j < slot.num; j++) {
        let val = j * sideLength + 'px';
        let style = position == 'top' ? { top: val } : { bottom: val };
        svgs.push(
          <svg key={j} height={sideLength} width={sideLength} style={style}>
            <circle
              cx="20"
              cy="20"
              r="18"
              stroke="black"
              strokeWidth="2"
              fill={slot.owner}
            />
          </svg>
        );
      }
    }
    return svgs;
  }

  getHomePieces(count, color, position) {
    let height = 250 / 15;
    let width = 50;
    let svgs = [];

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        let val = i * height + 'px';
        let style = position == 'top' ? { top: val } : { bottom: val };
        svgs.push(
          <svg key={i} height={height} width={width} style={style}>
            <rect
              height={height}
              width={width}
              stroke="black"
              strokeWidth="2"
              fill={color}
            />
          </svg>
        );
      }
    }
    return svgs;
  }

  render() {
    let isBlack = true;
    if (this.props.position == 'top') {
      isBlack = false;
    }

    let slots = [];
    let triangle = <div className="triangle" />;
    for (let i = 0; i < this.props.slots.length; i++) {
      if (i == 6) {
        slots.push(
          <td key={'knocked-' + this.props.color} className="knocked" />
        );
      }

      let slot = this.props.slots[i];
      var tdClasses = classNames(
        isBlack ? 'black' : '',
        slot.owner || '',
        this.props.selectedSlot == slot.idx ||
          this.props.highlightedSlots.includes(slot.idx)
          ? 'highlighted'
          : ''
      );
      let handler = this.props.highlightedSlots.includes(slot.idx)
        ? this.props.moveHandler
        : this.props.handler;
      slots.push(
        <td
          key={slot.idx}
          data-index={slot.idx}
          onClick={handler}
          className={tdClasses}
        >
          {triangle}
          {this.getSvgs(slot, this.props.position)}
        </td>
      );
      isBlack = !isBlack;
    }

    let homeColor = this.props.color;

    let homeClasses = classNames(
      'home',
      this.props.highlightedSlots.includes('home-' + homeColor)
        ? 'highlighted'
        : ''
    );

    slots.push(
      <td
        onClick={this.props.moveHomeHandler}
        key={this.props.position}
        className={homeClasses}
      >
        {this.getHomePieces(
          this.props.homeCount,
          homeColor,
          this.props.position
        )}
      </td>
    );

    return <tr className={this.props.position}>{slots}</tr>;
  }
}
