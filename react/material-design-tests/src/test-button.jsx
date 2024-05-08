/** MyAwesomeReactComponent.jsx */

var React = require('react'),
  mui = require('material-ui'),
  ThemeManager = new mui.Styles.ThemeManager(),
  RaisedButton = mui.RaisedButton;

var SomeAwesomeComponent = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  render: function() {
    return (
        <RaisedButton label="Default" />
    );
  }

});

module.exports = SomeAwesomeComponent;