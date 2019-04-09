import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import api from './api';
import channel from './channel';

function Header(props) {
  let { session, dispatch, cookies } = props;
  let session_info, email, password;

  if (!session) {
    let sessionObj = cookies.get('backgammon-user-session');

    if (sessionObj) {
      channel.init_channel(sessionObj);
    }
  }

  let now = new Date().getHours();

  let greeting;

  if (now < 12) {
    greeting = 'Morning';
  } else if (now >= 12 && now < 17) {
    greeting = 'Afternoon';
  } else {
    greeting = 'Evening';
  }

  function updateEmail(ev) {
    email = ev.target.value;
  }

  function updatePassword(ev) {
    password = ev.target.value;
  }

  function login() {
    api.create_session(email, password);
  }

  function logout() {
    cookies.remove('backgammon-user-session');
    let action = {
      type: 'LOGOUT_SESSION'
    };
    dispatch(action);
  }

  session_info = session ? (
    <div className="mb-2">
      <div>
        Good {greeting}, {session.first}
      </div>
      <button className="btn btn-secondary" onClick={() => logout()}>
        Logout
      </button>
    </div>
  ) : (
    <div>
      <form>
        <div className="form-group">
          <label>Email</label>
          <input type="email" className="form-control" onChange={updateEmail} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            onChange={updatePassword}
            onKeyPress={e => {
              if (e.key == 'Enter') {
                login();
              }
            }}
          />
        </div>
        <button className="btn btn-primary" onClick={login}>
          Login
        </button>
      </form>
      <div className="register">
        Don't have an account? Click here to{' '}
        <Link to={'/register'}>
          <button className="btn btn-secondary">Register</button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="mb-2">
      <div>
        <h1>Backgammon</h1>
      </div>
      <div>{session_info}</div>
    </div>
  );
}

export default withCookies(Header);
