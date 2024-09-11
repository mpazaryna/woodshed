import React    from 'react';
import Griddle  from 'griddle-react';

var mockData = require('../../dat/mock');

class GriddleAlpha extends React.Component {
  render() {
    return (
      <div>
        <Griddle results = {mockData} /> 
      </div>
    );
  }
}
   
export default GriddleAlpha;