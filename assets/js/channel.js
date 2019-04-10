import { Socket } from 'phoenix';
import api from './api';

class ChannelWrapper {
  init_channel(session) {
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

      let channel = socket.channel('homepage:' + session.user_id, {});
      channel.join().receive('ok', resp => {
        

        


      });
      
    });
  }
}

export default new ChannelWrapper();
