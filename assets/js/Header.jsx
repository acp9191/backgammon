import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import api from './api';
import channel from './channel';

function Header(props) {
  let { session, cookies } = props;
  let session_info, email, password, sessionObj, gameName;

  if (!session) {
    sessionObj = cookies.get('backgammon-user-session');

    if (sessionObj) {
      // channel.init_channel(sessionObj);
    }
  }

  console.log(sessionObj);

  function updateEmail(ev) {
    email = ev.target.value;
  }

  function updatePassword(ev) {
    password = ev.target.value;
  }

  function updateGameName(ev) {
    gameName = ev.target.value;
  }

  function join() {}

  function login() {
    api.create_session(email, password);
  }

  function logout() {
    cookies.remove('backgammon-user-session');
    // let action = {
    //   type: 'LOGOUT_SESSION'
    // };
    // dispatch(action);
  }

  session_info = sessionObj ? (
    <div className="form">
      <div className="center">Welcome back, {sessionObj.username}</div>
      <div className="center">
        Your record is {sessionObj.wins}-{sessionObj.losses}
      </div>
      <div className="center">
        <button className="btn btn-secondary" onClick={() => logout()}>
          Logout
        </button>
      </div>
      <div className="form-group">
        <label>Join Game</label>
        <input type="text" className="form-control" onChange={updateGameName} />
      </div>
      <button className="btn btn-primary" onClick={join}>
        Join
      </button>
    </div>
  ) : (
    <div>
      <div className="form">
        <div className="form-group">
          <label>Username</label>
          <input type="text" className="form-control" onChange={updateEmail} />
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
      </div>
      <div className="register">
        Don't have an account?{' '}
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
