import { configure } from '@kadira/storybook';

function loadStories() {
  require('../stories/button-one');
  require('../stories/button-two');
  require('../stories/about');
  require('../stories/say');
  require('../stories/increment');
  require('../stories/comment');
  // require as many stories as you need.
}

configure(loadStories, module);
