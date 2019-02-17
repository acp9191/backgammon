import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Row from './Row';
import KnockedPieces from './KnockedPieces';
import Die from './Die';
import _ from 'lodash';

export default function gameInit(root, channel, name) {
  channel
    .join()
    .receive('ok', resp => {
      console.log('Joined successfully', resp);
      ReactDOM.render(
        <Backgammon
          playerColor={resp.game.color}
          resp={resp}
          channel={channel}
        />,
        root
      );
    })
    .receive('error', resp => {
      console.log('Unable to join', resp);
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
    this.moveIn = this.moveIn.bind(this);
    this.moveHome = this.moveHome.bind(this);

    this.channel.on('update', resp => {
      this.update(resp);
    });
  }

  update(response) {
    console.log(response);
    this.setState({ game: response.game });
  }

  moveIn() {
    let moves = [];
    for (let i = 0; i < this.state.game.possible_moves.length; i++) {
      moves.push(this.state.game.possible_moves[i].to);
    }
    this.setState({ selectedSlot: 'knocked', highlightedSlots: moves });
  }

  getRoll() {
    this.channel.push('roll');
  }

  moveHome(e) {
    let td = e.target;
    if (td.tagName == 'svg' || td.tagName == 'rect') {
      td = td.parentNode;
    }
    if (td.tagName == 'svg') {
      td = td.parentNode;
    }

    if (td.classList.contains('highlighted')) {
      let moveTaken = this.state.game.possible_moves.filter(
        move => move.from == this.state.selectedSlot && move.to == 'home'
      )[0];

      this.channel.push('move', {
        move: moveTaken
      });
      this.setState({ selectedSlot: null, highlightedSlots: [] });
    }
  }

  makeMove(e) {
    let td = e.target.parentNode;
    if (td.tagName == 'svg') {
      td = td.parentNode;
    }

    if (td.classList.contains('highlighted')) {
      let moveTaken = this.state.game.possible_moves.filter(
        move =>
          move.from == this.state.selectedSlot && move.to == td.dataset.index
      )[0];

      this.channel.push('move', {
        move: moveTaken
      });
      this.setState({ selectedSlot: null, highlightedSlots: [] });
    }
  }

  selectSlot(e) {
    let td = e.target.parentNode;
    if (td.tagName == 'svg') {
      td = td.parentNode;
    }

    if (td.classList.contains(this.props.playerColor)) {
      if (this.state.selectedSlot == td.dataset.index) {
        this.setState({ selectedSlot: null, highlightedSlots: [] });
      } else {
        let moves = [];
        for (let i = 0; i < this.state.game.possible_moves.length; i++) {
          let move = this.state.game.possible_moves[i];
          if (move.from == td.dataset.index) {
            let dest =
              move.to == 'home' ? 'home-' + this.props.playerColor : move.to;

            moves.push(dest);
          }
        }
        this.setState({
          selectedSlot: td.dataset.index,
          highlightedSlots: moves
        });
      }
    }
  }

  render() {
    let filler = <span className="empty" />;
    let yourTurn =
      this.state.game.whose_turn == this.props.playerColor ? (
        <span>It is your turn</span>
      ) : (
        <span>Waiting on opponent</span>
      );

    let yourRoll =
      this.state.game.current_dice.length > 0 &&
      this.state.game.whose_turn == this.props.playerColor ? (
        <span>Your roll: {this.state.game.current_dice.join(' ')}</span>
      ) : (
        filler
      );

    let rollBtn =
      this.state.game.current_dice.length == 0 &&
      this.state.game.whose_turn == this.props.playerColor ? (
        <button onClick={this.getRoll}>Roll</button>
      ) : (
        filler
      );

    return (
      <div>
        <div className="subheader-wrapper">
          {/* <Die />
          <img src={require('../static/images/dice-six-faces-one.svg')} /> */}
          <span>You are {this.props.playerColor}</span>
          {yourTurn}
          {rollBtn}
          {yourRoll}
        </div>
        <KnockedPieces knocked={this.state.game.knocked} moveIn={this.moveIn} />
        <table>
          <tbody>
            <Row
              position="top"
              selectedSlot={this.state.selectedSlot}
              highlightedSlots={this.state.highlightedSlots}
              handler={this.selectSlot}
              moveHandler={this.makeMove}
              moveHomeHandler={this.moveHome}
              homeCount={this.state.game.home.red}
              slots={this.state.game.slots.slice(0, 12).reverse()}
            />
            <Row
              position="bottom"
              selectedSlot={this.state.selectedSlot}
              highlightedSlots={this.state.highlightedSlots}
              handler={this.selectSlot}
              moveHandler={this.makeMove}
              moveHomeHandler={this.moveHome}
              homeCount={this.state.game.home.white}
              slots={this.state.game.slots.slice(12, 24)}
            />
          </tbody>
        </table>
      </div>
    );
  }
}
