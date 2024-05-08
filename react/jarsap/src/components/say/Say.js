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
