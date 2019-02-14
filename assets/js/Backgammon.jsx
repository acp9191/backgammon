import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function gameInit(root, channel) {
  channel.join()
    .receive('ok', resp => {
      console.log("Joined successfully", resp);
      ReactDOM.render(<Backgammon resp={resp} channel={channel}/>, root);
    })
    .receive('error', resp => {
      console.log("Unable to join", resp);
    });
}

class Backgammon extends Component {

  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = {
      game: props.resp.game
    };

    this.channel.on('update', resp => {
      this.update(resp);
    });
  }

  update(response) {
    this.setState(response.game);
  }

  render() {
    return (
      <div>
        <table>
          <tbody>
            <Row position="top" slots={this.state.game.slots.slice(0, 12)}/>
            <Row position="bottom" slots={this.state.game.slots.slice(12, 24)}/>
          </tbody>
        </table>
      </div>
    );
  }
}

class Row extends Component {
  constructor(props) {
    super(props);

    console.log(props);
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
    if (this.props.position == "top") {
      // TODO: figure out how to do this in one for loop
      for (let i = this.props.slots.length - 1; i >= 0; i--) {
        slots.push(
          <td key={i} className={this.props.slots[i].owner || ''}>
            {triangle}
            {this.getSvgs(this.props.slots[i], this.props.position)}
          </td>);
      }
    } else {
      for (let i = 0; i < this.props.slots.length; i++) {
        slots.push(
          <td key={i} className={this.props.slots[i].owner || ''}>
            {triangle}
            {this.getSvgs(this.props.slots[i], this.props.position)}
          </td>);
      }
    }
    return <tr className={this.props.position}>{slots}</tr>
  }
}