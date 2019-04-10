import React from 'react';
import { withRouter } from 'react-router-dom';

import api from './api';

const RegisterForm = withRouter(({ history }) => {
  let username, password;

  function updateUsername(ev) {
    username = ev.target.value;
  }

  function updatePassword(ev) {
    password = ev.target.value;
  }

  function redirect() {
    history.push('/');
  }

  function register() {
    api.create_user(username, password, redirect);
  }

  let registerForm = (
    <div className="form">
      <div className="form-group">
        <label>Username</label>
        <input type="text" className="form-control" onChange={updateUsername} />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          onChange={updatePassword}
          onKeyPress={e => {
            if (e.key == 'Enter') {
              register();
            }
          }}
        />
      </div>
      <button className="btn btn-primary" onClick={register}>
        Register
      </button>
    </div>
  );

  return (
    <div className="mb-2">
      <div>
        <h1>Backgammon</h1>
      </div>
      <div>{registerForm}</div>
    </div>
  );
});

export default RegisterForm;
