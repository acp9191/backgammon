import { Socket } from 'phoenix';
import api from './api';

class ChannelWrapper {

  init_channel(session, gameName) {

    console.log(session)

    let socket = new Socket('/socket', { params: session });
    socket.connect();
    socket.onError(() => {
      // store.dispatch({
      //   type: 'LOGOUT_SESSION'
      // });
      socket.disconnect();
    });
    socket.onOpen(() => {
      // store.dispatch({
      //   type: 'NEW_SESSION',
      //   data: session
      // });

      channel = socket.channel("games:" + gameName, {
        "user": session.userName
      });

      return channel;
      
    });
  }
}

export default new ChannelWrapper();
