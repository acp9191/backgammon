import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root, channel) {
  channel.join()
    .receive('ok', resp => {
      console.log("Joined successfully", resp);
      ReactDOM.render(<Backgammon channel={channel}/>, root);
    })
    .receive('error', resp => {
      console.log("Unable to join", resp);
    });
}

class Backgammon extends Component {

  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = {};
  }

  render() {
    return (
      <div>
        Backgammon
      </div>
    );
  }
}