The Basics of CSS Modules
=========================

CSS Modules provide:

* Locally scoped CSS class names.
* Explicit sharing using composition.
* CSS Modules rewrite class names, but they don't touch tag names.

After reading this guide, you will know:

* How to install the dependencies.
* How to structure your component.
* How to structure your component based css.
* How a CSS module imports a JavaScript object.

Suggestions:

* Never use a selector that is JUST a tag name.
* Always specify a class name also. Otherwise the CSS rule will apply globally to your entire app.

--------------------------------------------------------------------------------

Setup
-----

```bash
$ npm install style-loader --save
$ npm install css-loader --save
$ npm install react-css-modules --save
```

Example Component
-----------------

```js

import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './style.css';

console.log('Say styles:', styles);

const Say = (props) => (
  <div className="say">
    <h2 className={styles.title}>{props.word}</h2>
  </div>
);

Say.propTypes = {
  word: React.PropTypes.string.isRequired,
};

export default Say;
```

Example CSS
-----------

```css
.title {
  font-size: 24px;
  font-style: italic;
}
```

### References

* [CSS Modules by Example](http://andrewhfarmer.com/css-modules-by-example/)
* [Github project](https://github.com/css-modules/css-modules)
