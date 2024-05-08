import { configure } from '@kadira/storybook';

//require("bootstrap/dist/css/bootstrap.css");
//require("react-bootstrap-table/dist/react-bootstrap-table-all.min.css");

require("mdbootstrap/css/bootstrap.min.css");
require("mdbootstrap/css/mdb.min.css");
 
function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
