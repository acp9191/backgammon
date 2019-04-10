import { Socket } from 'phoenix';
import store from './store';
// import api from './api';

class ChannelWrapper {

  init_channel(session, gameName) {

    // console.log(session, gameName)

    let socket = new Socket('/socket', { params: session });
    socket.connect();
    socket.onError(() => {
      store.dispatch({
        type: 'LOGOUT_SESSION'
      });
      socket.disconnect();
    });
    socket.onOpen(() => {
      let channel = socket.channel("games:" + gameName, {
        "user": session.username
      });
      channel.join().receive('ok', resp => {
        console.log(resp);
        store.dispatch({
          type: 'NEW_GAME',
          data: resp.game
        })
      })

      // console.log(channel)

      

      // window.location.href = '/game/' + gameName;
    });
  }
}

export default new ChannelWrapper();
