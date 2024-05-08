import React from 'react';
import { Link } from 'react-router';

const App = ({ children }) => (
  <div className="main-container">
    <ul>
      <li><Link to="/hello">hello</Link></li>
      <li><Link to="/say">say</Link></li>
      <li><Link to="/world">world</Link></li>
      <li><Link to="/increment">increment</Link></li>
      <li><Link to="/comment">comment</Link></li>
    </ul>
    <div className="container">
      {children}
    </div>
  </div>
);

App.propTypes = { children: React.PropTypes.object };

export default App;
