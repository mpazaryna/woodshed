var React    = require('react')
var DataGrid = require('react-datagrid')
var data     = require('../../dat/mock');

/**
 * data is an array with 1000 items, like:
 * [
 * 		{ id: 0, index: 1, firstName: 'John', city: 'London', 'email: jon@gmail.com'},
 * 		{ id: 1, .... }
 * ]
 */

var columns = [
	{ name: 'id' },
	{ name: 'name' },
	{ name: 'city'  },
	{ name: 'state' },
	{ name: 'country' }
]

var RdgTestAlpha = React.createClass({
	render: function(){
		return <DataGrid
			idProperty='id'
			dataSource={data}
			columns={columns}
		/>
	}
})

export default RdgTestAlpha;