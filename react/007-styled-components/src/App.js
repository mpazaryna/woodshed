import React, { Component } from 'react';
import logo from './logo.svg';
import styled from 'styled-components';
import {keyframes} from 'styled-components'

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

const spinLogoAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const App = styled.div`
  text-align: center;
`;

export const Logo = styled.img`
  animation: ${spinLogoAnimation} infinite 20s linear;
  height: 80px;
`;

export const Header = styled.div`
  background-color: #222;
  height: 150px;
  padding: 20px;
  color: white;
`;

export const Intro = styled.p`
    font-size: large;
`;

class Main extends Component {
  render() {
    return (
      <App>
        <Header>
          <Logo src={logo} className="App-logo" alt="logo"/>
          <h2>Welcome to React</h2>
        </Header>
        <Intro>
          To get started, edit <code>src/App.js</code> and save to reload.
        </Intro>
        <Wrapper>
          <Title>This is the title</Title>
        </Wrapper>
      </App>
    );
  }
}

export default Main;
