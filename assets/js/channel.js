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
        store.dispatch({
          type: 'NEW_GAME',
          data: resp.game
        });

        let username = session.username;

        store.dispatch({
          type: 'NEW_PLAYER_COLOR',
          data: resp.game['players'][username]
        });
      });

      this.socketChannel.on('update', resp => {
        store.dispatch({
          type: 'NEW_GAME',
          data: resp.game
        });
      });
    });
  }
}

export default new ChannelWrapper();
