import React from 'react';
import _ from 'lodash';
import { Link, withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import api from './api';
import channel from './channel';
import store from './store';

const Header = withRouter(({ history, session, cookies, leaders }) => {
  let session_info, email, password, gameName, leaderboard;

  if (!session) {
    api.get_leaders();
    session = cookies.get('backgammon-user-session');
    if (session) {
      api.get_fresh_session(session.id);
    }
  }

  function updateEmail(ev) {
    email = ev.target.value;
  }

  function updatePassword(ev) {
    password = ev.target.value;
  }

  function updateGameName(ev) {
    gameName = ev.target.value;
  }

  function join() {
    channel.init_channel(session, gameName);
    history.push(`/game/${gameName}`);
  }

  function login() {
    api.create_session(email, password);
  }

  function logout() {
    cookies.remove('backgammon-user-session');
    store.dispatch({
      type: 'LOGOUT_SESSION'
    });
  }

  leaderboard = [];

  leaders ? (
    _.map(leaders, (leader, i) => {
      leaderboard.push(
        <tr key={leader.id}>
          <td>{i + 1}.</td>
          <td>{leader.username}</td>
          <td>
            {leader.wins}-{leader.losses}
          </td>
        </tr>
      );
    })
  ) : (
    <tr />
  );

  session_info = session ? (
    <div className="form">
      <div className="center">Welcome back, {session.username}</div>
      <div className="center">
        Your record is {session.wins}-{session.losses}
      </div>
      <div className="center">
        <button className="btn btn-secondary" onClick={() => logout()}>
          Logout
        </button>
      </div>
      <div className="form-group">
        <label>Join Game</label>
        <input
          type="text"
          className="form-control"
          onKeyPress={e => {
            if (e.key == 'Enter') {
              join();
            }
          }}
          onChange={updateGameName}
        />
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
      <h1>Leaderboard</h1>
      <table className="leaderboard">
        <tbody>{leaderboard}</tbody>
      </table>
    </div>
  );
});

function state2props(state) {
  return { session: state.session, leaders: state.leaders };
}

export default connect(state2props)(withCookies(Header));
