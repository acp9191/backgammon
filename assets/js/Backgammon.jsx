import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import { Stage, Layer, Rect, Circle } from 'react-konva';
// import Konva from 'konva';
import _ from 'lodash';
// import {Rectangle, Circle, Ellipse, Line, Polyline, CornerBox, Triangle} from 'react-shapes';

export default function game_init(root, channel) {
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
            <tr className="top">
              <TopRow slots={this.state.game.slots.slice(0, 12)}/>
            </tr>
            <tr className="bottom">
              <BottomRow slots={this.state.game.slots.slice(12, 24)}/>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}


class TopRow extends Component {

  constructor(props) {
    super(props);

    console.log(props);
  }
  render() {

    let slots = [];

    for (let i = this.props.slots.length - 1; i >= 0; i--) {
      if (this.props.slots[i].hasOwnProperty('owner')) {
        let svgs = [];
        for (let j = 0; j < this.props.slots[i].num; j++) {
          let style = {top: (j * 50) + "px"};
          svgs.push(
            <svg key={j} height="50" width="50" style={style}>
              <circle cx="25" cy="25" r="23" stroke="black" strokeWidth="2" fill={this.props.slots[i].owner} />
            </svg>
          );
        }

        slots.push(
          <td key={i} className={this.props.slots[i].owner}>
            <div className="triangle"></div>
            {svgs}
          </td>
          );
      } else {
        slots.push(<td key={i}><div className="triangle"></div></td>);
      }
    }

    return slots;
  }
}

class BottomRow extends Component {

  constructor(props) {
    super(props);

    console.log(props);
  }
  render() {

    let slots = [];

    for (let i = 0; i < this.props.slots.length; i++) {
      if (this.props.slots[i].hasOwnProperty('owner')) {
        let svgs = [];
        for (let j = 0; j < this.props.slots[i].num; j++) {
          let style = {bottom: (j * 50) + "px"};
          svgs.push(
            <svg key={j} height="50" width="50" style={style}>
              <circle cx="25" cy="25" r="23" stroke="black" strokeWidth="2" fill={this.props.slots[i].owner} />
            </svg>
          );
        }

        slots.push(
          <td key={i} className={this.props.slots[i].owner}>
            <div className="triangle bottom"></div>
            {svgs}
          </td>
          );
      } else {
        slots.push(<td key={i}><div className="triangle bottom"></div></td>);
      }
    }

    return slots;
  }
}