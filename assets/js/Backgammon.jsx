import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import _ from 'lodash';

export default function gameInit(root, channel) {
  channel.join()
    .receive('ok', resp => {
      console.log("Joined successfully", resp);
      ReactDOM.render(<Backgammon playerColor="white" resp={resp} channel={channel}/>, root);
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
      game: props.resp.game,
      selectedSlot: null,
      highlightedSlots: []
    };

    this.selectSlot = this.selectSlot.bind(this);
    this.getRoll = this.getRoll.bind(this);
    this.makeMove = this.makeMove.bind(this);

    this.channel.on('update', resp => {
      this.update(resp);
    });
  }

  update(response) {
    console.log(response);
    this.setState({game: response.game});
  }

  getRoll() {
    this.channel.push('roll');
  }

  makeMove(e) {

    console.log("move")

    let td = e.target.parentNode;
    if (td.tagName == "svg") {
      td = td.parentNode;
    }

    if (td.classList.contains("highlighted")) {
      this.channel.push("move", {move: [this.state.selectedSlot, td.dataset.index]});
    }
  }

  selectSlot(e) {
    let td = e.target.parentNode;
    if (td.tagName == "svg") {
      td = td.parentNode;
    }

    if (td.classList.contains(this.props.playerColor)) {
      if (this.state.selectedSlot == td.dataset.index) {
        this.setState({ selectedSlot: null, highlightedSlots: []});
      } else {
        let moves = [];
        for (let i = 0; i < this.state.game.possible_moves.length; i++) {
          let move = this.state.game.possible_moves[i];
          if (move[0] == td.dataset.index) {
            moves.push(move[1]);
          }
        }
        this.setState({ selectedSlot: td.dataset.index, highlightedSlots: moves });
      }
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.getRoll}>Roll</button>
        <table>
          <tbody>
            {/* REMEMBER: Top row is backwards */}
            <Row position="top" 
                 selectedSlot={this.state.selectedSlot}
                 highlightedSlots={this.state.highlightedSlots}
                 handler={this.selectSlot} 
                 moveHandler={this.makeMove}
                 slots={this.state.game.slots.slice(0, 12).reverse()}/>
            <Row position="bottom" 
                 selectedSlot={this.state.selectedSlot}
                 highlightedSlots={this.state.highlightedSlots}
                 handler={this.selectSlot} 
                 moveHandler={this.makeMove}
                 slots={this.state.game.slots.slice(12, 24)}/>
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