import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import _ from 'lodash';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import RegisterForm from './RegisterForm';
import Backgammon from './Backgammon';

export default function root_init(node, store) {
  ReactDOM.render(
    <CookiesProvider>
      <Provider store={store}>
        <Router>
          <Route path="/" exact={true} render={() => <Header />} />
          <Route path="/game/:game" render={() => <Backgammon />} />
          <Route
            path="/register"
            exact={true}
            render={() => <RegisterForm />}
          />
        </Router>
      </Provider>
    </CookiesProvider>,
    node
  );
}
