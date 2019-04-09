import React from 'react';
import { withRouter } from 'react-router-dom';

import api from './api';

const RegisterForm = withRouter(({ history }) => {
  let firstName, lastName, email, password;

  function updateFirstName(ev) {
    firstName = ev.target.value;
  }

  function updateLastName(ev) {
    lastName = ev.target.value;
  }

  function updateEmail(ev) {
    email = ev.target.value;
  }

  function updatePassword(ev) {
    password = ev.target.value;
  }

  function redirect() {
    history.push('/');
  }

  function register() {
    api.create_user(firstName, lastName, email, password, redirect);
  }

  let registerForm = (
    <div>
      <input type="text" placeholder="First Name" onChange={updateFirstName} />
      &nbsp;
      <input type="text" placeholder="Last Name" onChange={updateLastName} />
      &nbsp;
      <input type="email" placeholder="Email" onChange={updateEmail} />
      &nbsp;
      <input
        type="password"
        placeholder="Password"
        onChange={updatePassword}
        onKeyPress={e => {
          if (e.key == 'Enter') {
            register();
          }
        }}
      />
      &nbsp;
      <button className="btn btn-secondary" onClick={register}>
        Register
      </button>
    </div>
  );

  return (
    <div className="mb-2">
      <div>
        <h1>My Homepage</h1>
      </div>
      <div>{registerForm}</div>
    </div>
  );
});

export default RegisterForm;
