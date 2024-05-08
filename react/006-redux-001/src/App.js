import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { TodoList } from './containers';
import reducer from './reducer';
const store = createStore(reducer);

class App extends Component {
  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <TodoList />
        </Provider>
      </div>
    );
  }
}

export default App;
