import React          from 'react';
import TestDialog     from './test-dialog';
import TestButton     from './test-button';

class HelloWorldTest extends React.Component {
  render() {
    return (
      <div>
        <TestButton />
        <TestDialog />
      </div>
    );
  }
} 
 
React.render(<HelloWorldTest />, document.body);
