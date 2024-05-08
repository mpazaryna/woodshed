import React    from 'react';
import Griddle  from 'griddle-react';

// var mockData = require('../lib/griddle-data');
var mockData      = require('../../dat/mock');

// Variables defined with let have block-level scope
let url = "";

var LinkComponent = React.createClass({
  render: function(){
    url ="speakers-profile/" + this.props.rowData.state + "/" + this.props.data;
    return <a href={url}>{this.props.data}</a>
  }
});

var exampleMetadata = [ 
{
  "columnName": "name",
  "order": 1,
  "locked": false,
  "visible": true,
  "displayName": "Name",
  "customComponent": LinkComponent
},
{
  "columnName": "city",
  "order": 2,
  "locked": false,
  "visible": true,
  "displayName": "City"
},
{
  "columnName": "state",
  "order": 3,
  "locked": false,
  "visible": true,
  "displayName": "State"
},
{
  "columnName": "country",
  "order": 4,
  "locked": false,
  "visible": true,
  "displayName": "Country"
},
{
  "columnName": "company",
  "order": 5,
  "locked": false,
  "visible": true,
  "displayName": "Company"
}
];

class GriddleTest extends React.Component {
  render() {
    return (
      <div>
        <Griddle 
          results = {mockData} 
          tableClassName = "table" 
          showFilter = {true}
          showSettings = {false} 
          columnMetadata = {exampleMetadata} 
          columns = {["name","city","state","country"]}/>
      </div>
    );
  }
}
   
export default GriddleTest;