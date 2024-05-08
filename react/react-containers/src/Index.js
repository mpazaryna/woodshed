import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import App from './components/App';
import PoweredBy from './components/Powered-by';
import Subjective from './containers/SubjectiveContainer';
import About from './containers/AboutContainer';
import AboutStatic from './containers/AboutContainerStatic';
import PatientContainer from './containers/PatientContainer';

window.React = React;

render(
  (<Router history={hashHistory}>
    <Route path="/" component={App}>
      <Route path="/about" component={About} />
      <Route path="/poweredby" component={PoweredBy} />
      <Route path="/subjective" component={Subjective} />
      <Route path="/patient" component={PatientContainer} />
      <Route path="/about-static" component={AboutStatic} />
    </Route>
  </Router>), document.getElementById('content')
);
