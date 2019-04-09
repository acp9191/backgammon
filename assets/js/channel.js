import { Socket } from 'phoenix';
import api from './api';

class ChannelWrapper {
  init_channel(session) {
    let socket = new Socket('/socket', { params: session });
    socket.connect();
    socket.onError(() => {
      store.dispatch({
        type: 'LOGOUT_SESSION'
      });
      socket.disconnect();
    });
    socket.onOpen(() => {
      store.dispatch({
        type: 'NEW_SESSION',
        data: session
      });

      let channel = socket.channel('homepage:' + session.user_id, {});
      channel.join().receive('ok', resp => {
        this.sendCoords(channel);
        setInterval(() => {
          this.sendCoords(channel);
        }, 30000);
      });
      channel.on('bg_img', resp => {
        store.dispatch({
          type: 'NEW_BG_IMG',
          data: resp.url
        });
      });
      channel.on('forecast', resp => {
        store.dispatch({
          type: 'NEW_WEATHER',
          data: resp.forecast
        });
      });
      channel.on('predictions', resp => {
        store.dispatch({
          type: 'NEW_PREDICTIONS',
          data: resp.predictions
        });
      });
      channel.on('quote', resp => {
        store.dispatch({
          type: 'NEW_QUOTE',
          data: resp.quote
        });
      });

      api.get_seeds().then(() => {
        api.get_music();
      })
    });
  }

  sendCoords(channel) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        channel.push('coords', {
          latitude: latitude.toString(),
          longitude: longitude.toString()
        });
      });
    } else {
      console.log("No geolocation");
    }
  }
}

export default new ChannelWrapper();
