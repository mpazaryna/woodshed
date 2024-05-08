// index.jsx
 
import React from 'react';
import HelloWorld from './hello-world';
import Footer from './footer';
import Header from './header';

class HelloWorldTest extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <HelloWorld />
        <Footer />
      </div>
    );
  }
} 
 
React.render(
  <HelloWorldTest />,
  document.body
);
