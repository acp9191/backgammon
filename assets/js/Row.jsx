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
        let val = (j * sideLength) + "px"
        let style = (position == "top" ? {top : val} : {bottom : val});
        svgs.push(
          <svg key={j} height={sideLength} width={sideLength} style={style}>
            <circle cx="20" cy="20" r="18" stroke="black" strokeWidth="2" fill={slot.owner} />
          </svg>
        );
      }
    } 
    return svgs;
  }

  render() {
    let slots = [];
    let triangle = <div className="triangle"></div>
    for (let i = 0; i < this.props.slots.length; i++) {
      let slot = this.props.slots[i];
      var tdClasses = classNames(
        slot.owner || '',
        this.props.selectedSlot == slot.idx || this.props.highlightedSlots.includes(slot.idx) ? "highlighted" : ''
       );
      let handler = this.props.handler;
      if (this.props.highlightedSlots.includes(slot.idx)) {
        handler = this.props.moveHandler;
      }
      slots.push(
        <td key={slot.idx} data-index={slot.idx} onClick={handler} className={tdClasses}>
          {triangle}
          {this.getSvgs(slot, this.props.position)}
        </td>);
    }
    return <tr className={this.props.position}>{slots}</tr>
  }
}