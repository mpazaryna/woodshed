import React          from 'react';  
import Router         from 'react-router';  
import GriddleHandler from './components/griddle/main.jsx';
import RdgHandler     from './components/rdg/main.jsx';
import AboutHandler   from './components/about/main.jsx';

import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';

let App = React.createClass({  
  render() {
    return (
      <div className="wrap">
        <div className="sidebar">
          <Link to="app">Home</Link>&nbsp;
          <Link to="griddle">Griddle</Link>&nbsp;
          <Link to="rdg">React Data Grid</Link>&nbsp;
          <Link to="about">About Data Grids</Link>
        </div>
        <div className="content">
          {/* this is the importTant part */}
          <RouteHandler/>
        </div>  
      </div>
    );
  }
});

let routes = (  
  <Route name="app" path="/" handler={App}>
    <Route name="griddle" path="/griddle" handler={GriddleHandler}/>
    <Route name="rdg"     path="/rdg"     handler={RdgHandler}/>
    <Route name="about"   path="/about"   handler={AboutHandler}/>
  </Route>
);

Router.run(routes, function (Handler) {  
  React.render(<Handler/>, document.body);
});
