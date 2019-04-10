import { Socket } from 'phoenix';
import store from './store';

class ChannelWrapper {
  init_channel(session, gameName) {
    let socket = new Socket('/socket', { params: session });
    socket.connect();
    socket.onError(() => {
      store.dispatch({
        type: 'LOGOUT_SESSION'
      });
      socket.disconnect();
    });
    socket.onOpen(() => {
      this.socketChannel = socket.channel("games:" + gameName, {
        "user": session.username
      });

      this.socketChannel.join().receive('ok', resp => {
        console.log(resp);
        store.dispatch({
          type: 'NEW_GAME',
          data: resp.game
        });

        let username = session.username;

        store.dispatch({
          type: 'NEW_PLAYER_COLOR',
          data: resp.game['players'][username]
        });

        this.update_messages(resp.game);
      });

      this.socketChannel.on('update', resp => {
        console.log(resp)

        this.update_messages(resp.game);

        store.dispatch({
          type: 'NEW_GAME',
          data: resp.game
        });
      });
    });
  }

  update_messages(game) {
    let playerColor = store.getState().playerColor;

    game.chat.map(msg => {
      msg.author = msg.author == playerColor ? 'me' : 'them';
    });

    store.dispatch({
      type: "NEW_MESSAGE_LIST",
      data: game.chat
    })
  }
}

export default new ChannelWrapper();
