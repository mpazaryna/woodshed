import React from 'react';
import { Link } from 'react-router';

const App = ({ children }) => (
  <div>
    <header>
      <h1>App Title</h1>
      <Link to="/about">About</Link>
      <Link to="/subjective">Subjective</Link>
      <Link to="/Patient">Patient</Link>
      <Link to="/about-static">About Static</Link>
    </header>
    <section>
      {children || 'Welcome to the app'}
    </section>
  </div>
);

App.propTypes = { children: React.PropTypes.object };

export default App;
