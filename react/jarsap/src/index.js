import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import App from './app';
import Hello from './containers/HelloContainer';
import Say from './containers/SayContainer';
import World from './containers/WorldContainer';
import Increment from './containers/IncrementContainer';
import Comment from './containers/CommentContainer';

window.React = React;

render(
  (<Router history={hashHistory}>
    <Route path="/" component={App}>
      <Route path="/hello" component={Hello} />
      <Route path="/say" component={Say} />
      <Route path="/world" component={World} />
      <Route path="/increment" component={Increment} />
      <Route path="/comment" component={Comment} />
    </Route>
  </Router>), document.getElementById('app')
);
