import { configure } from '@kadira/storybook';

function loadStories() {
  // require('../src/stories');
  require('../src/stories/About');
  require('../src/stories/Button');
  require('../src/stories/App');
}

configure(loadStories, module);
