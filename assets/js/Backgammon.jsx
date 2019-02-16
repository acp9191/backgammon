import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Row from './Row';
import KnockedPieces from './KnockedPieces';
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
      highlightedSlots: [],
      hasRolled: false
    };

    this.selectSlot = this.selectSlot.bind(this);
    this.getRoll = this.getRoll.bind(this);
    this.makeMove = this.makeMove.bind(this);
    this.moveIn = this.moveIn.bind(this);

    this.channel.on('update', resp => {
      this.update(resp);
    });
  }

  update(response) {
    console.log(response);
    this.setState({game: response.game});
  }

  moveIn(e) {
    let moves = [];
    for (let i = 0; i < this.state.game.possible_moves.length; i++) {
      moves.push(this.state.game.possible_moves[i][1]);
    }
    this.setState({ selectedSlot: "knocked", highlightedSlots: moves});
  }

  getRoll() {
    this.channel.push('roll');
  }

  makeMove(e) {
    let td = e.target.parentNode;
    if (td.tagName == "svg") {
      td = td.parentNode;
    }

    if (td.classList.contains("highlighted")) {
      this.channel.push("move", {move: [this.state.selectedSlot, td.dataset.index]});
      this.setState({ selectedSlot: null, highlightedSlots: []});
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

    let yourTurn = <div></div>;

    if (this.state.game.whose_turn == this.props.playerColor) {
      yourTurn = <div>Your Turn</div>
    }

    let yourRoll = <div></div>;

    if (this.state.game.current_dice.length > 0 && this.state.game.whose_turn == this.props.playerColor) {
      yourRoll = <div>Your roll: {this.state.game.current_dice.join(' ')}</div>
    }

    let rollBtn = <div></div>

    if (this.state.game.current_dice.length == 0 && this.state.game.whose_turn == this.props.playerColor) {
      rollBtn = <button onClick={this.getRoll}>Roll</button>;
    }

    return (
      <div>
        <div>You are {this.props.playerColor}</div>
        {rollBtn}
        {yourRoll}
        {yourTurn}
        <KnockedPieces knocked={this.state.game.knocked}
                       moveIn={this.moveIn}/>
        <table>
          <tbody>
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