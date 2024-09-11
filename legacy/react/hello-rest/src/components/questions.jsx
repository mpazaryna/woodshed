import React from 'react';
import Header from './core/header';
import Footer from './core/footer';
import Api from './questions/api';

class Questions extends React.Component {
  render() {
      return (
        <div className="container-fluid">
          <Header />
          <Api />
          <Footer />
        </div>
      );
    }
  }

export default Questions;
