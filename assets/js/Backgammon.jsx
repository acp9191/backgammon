import React, { Component } from 'react';
import Row from './Row';
import Subheader from './Subheader';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Launcher } from 'react-chat-window';

const Backgammon = ({ game, session }) => {
  let playerColor,
    firstTwelveSlots,
    lastTwelveSlots,
    topSlots,
    bottomSlots,
    topColor;
  // constructor(props) {
  //   super(props);
  //   this.channel = socket.channel;
  //   this.state = {
  //     // game: props.resp.game,
  //     selectedSlot: null,
  //     highlightedSlots: [],
  //     messageList: []
  //   };

  //   this.selectSlot = this.selectSlot.bind(this);
  //   this.getRoll = this.getRoll.bind(this);
  //   this.makeMove = this.makeMove.bind(this);
  //   this.moveIn = this.moveIn.bind(this);
  //   this.moveHome = this.moveHome.bind(this);
  //   this.onMessageWasSent = this.onMessageWasSent.bind(this);
  //   this.reset = this.reset.bind(this);

  //   this.channel.on('update', resp => {
  //     this.update(resp);
  //   });

  //   this.channel.on('reset', () => {
  //     window.location.href = '/';
  //   });
  // }

  function mapMessages() {
    this.state.game.chat.map(msg => {
      msg.author = msg.author == this.props.playerColor ? 'me' : 'them';
    });
    this.setState({ messageList: this.state.game.chat });
  }

  function update(response) {
    this.setState({ game: response.game }, () => {
      this.mapMessages();
    });
  }

  function getRoll() {
    this.channel.push('roll');
  }

  function isAllowedToMove() {
    return this.state.game.whose_turn == this.props.playerColor;
  }

  function getTd(td) {
    return td.tagName == 'svg' || td.tagName == 'rect' ? td.parentNode : td;
  }

  function getMoveTaken(moveTo) {
    return this.state.game.possible_moves.filter(
      move => move.from == this.state.selectedSlot && move.to == moveTo
    )[0];
  }

  function moveAndClearSlot(moveTaken) {
    if (moveTaken) {
      this.channel.push('move', {
        move: moveTaken
      });
    }
    this.setState({ selectedSlot: null, highlightedSlots: [] });
  }

  function isHighlighted(td) {
    return td.classList.contains('highlighted');
  }

  function moveHome(e) {
    if (this.isAllowedToMove()) {
      let td = this.getTd(this.getTd(e.target));
      if (this.isHighlighted(td)) {
        this.moveAndClearSlot(this.getMoveTaken('home'));
      }
    }
  }

  function makeMove(e) {
    if (this.isAllowedToMove()) {
      let td = this.getTd(e.target.parentNode);
      if (this.isHighlighted(td)) {
        this.moveAndClearSlot(this.getMoveTaken(td.dataset.index));
      }
    }
  }

  function moveIn() {
    if (this.isAllowedToMove()) {
      let moves = [];
      for (let i = 0; i < this.state.game.possible_moves.length; i++) {
        moves.push(this.state.game.possible_moves[i].to);
      }
      this.setState({ selectedSlot: 'knocked', highlightedSlots: moves });
    }
  }

  function selectSlot(e) {
    if (this.isAllowedToMove() && this.state.game.current_dice.length > 0) {
      let td = this.getTd(e.target.parentNode);
      let idx = td.dataset.index;

      if (td.classList.contains(this.props.playerColor)) {
        if (this.state.selectedSlot == idx) {
          this.moveAndClearSlot(null);
        } else {
          let moves = [];
          for (let i = 0; i < this.state.game.possible_moves.length; i++) {
            let move = this.state.game.possible_moves[i];
            if (move.from == idx) {
              let dest =
                move.to == 'home' ? 'home-' + this.props.playerColor : move.to;
              moves.push(dest);
            }
          }
          this.setState({
            selectedSlot: idx,
            highlightedSlots: moves
          });
        }
      }
    }
  }

  function onMessageWasSent(chat) {
    chat.author = this.props.playerColor;
    this.channel.push('chat', { chat: chat });
  }

  function reset() {
    this.channel.push('reset');
  }

  if (game) {
    let username = session.username;
    playerColor = game['players'][username];

    firstTwelveSlots = game.slots.slice(0, 12).reverse();
    lastTwelveSlots = game.slots.slice(12, 24);

    topSlots = playerColor == 'white' ? firstTwelveSlots : lastTwelveSlots;
    bottomSlots = playerColor == 'white' ? lastTwelveSlots : firstTwelveSlots;

    topColor = playerColor == 'white' ? 'red' : 'white';
  }

  let rows = game ? (
    <tbody>
      <Row
        isTop={true}
        color={topColor}
        playerColor={playerColor}
        // selectedSlot={this.state.selectedSlot}
        // highlightedSlots={this.state.highlightedSlots}
        handler={selectSlot}
        moveHandler={makeMove}
        moveHomeHandler={moveHome}
        homeCount={game.home[topColor]}
        knockedCount={game.knocked[topColor]}
        slots={topSlots}
      />
      <Row
        isTop={false}
        color={playerColor}
        playerColor={playerColor}
        // selectedSlot={this.state.selectedSlot}
        // highlightedSlots={this.state.highlightedSlots}
        handler={selectSlot}
        moveHandler={makeMove}
        moveHomeHandler={moveHome}
        moveInHandler={moveIn}
        homeCount={game.home[playerColor]}
        knockedCount={game.knocked[playerColor]}
        slots={bottomSlots}
      />
    </tbody>
  ) : (
    <tbody />
  );

  let gameDisplay = (
    <div>
      {/* <Subheader
          state={this.state}
          playerColor={playerColor}
          getRoll={this.getRoll}
          reset={this.reset}
        /> */}
      <table>{rows}</table>
      {/* <Launcher
        agentProfile={{
          teamName: 'Backgammon Chat'
        }}
        onMessageWasSent={this.onMessageWasSent}
        messageList={this.state.messageList}
        showEmoji
      /> */}
    </div>
  );

  return gameDisplay;
};

function state2props(state) {
  return { game: state.game, session: state.session };
}

export default connect(state2props)(Backgammon);
