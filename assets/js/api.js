import channel from './channel';
import store from './store';
import $ from 'jquery';

class Server {
  send_post(path, data, callback, error_callback) {
    return $.ajax(path, {
      method: 'post',
      dataType: 'json',
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify(data),
      success: callback,
      error: error_callback
    });
  }

  setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }

  create_session(username, password) {
    return this.send_post(
      '/api/authorize',
      {
        username,
        password
      },
      resp => {
        this.setCookie('backgammon-user-session', JSON.stringify(resp.data), 7);
        store.dispatch({
          type: 'NEW_SESSION',
          data: resp.data
        })
      },
      (request, _status, _error) => {
        if (request) {
          alert('Invalid Email or Password');
        }
      }
    );
  }

  create_user(username, password, redirect) {
    return this.send_post(
      '/api/users',
      {
        user: {
          username,
          password
        }
      },
      () => {
        this.create_session(username, password);
        redirect();
      },
      (request, _status, _error) => {
        if (request) {
          alert('Username already taken');
        }
      }
    );
  }
}

export default new Server();
