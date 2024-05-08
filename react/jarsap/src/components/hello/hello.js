import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './style.css';

console.log('Hello styles:', styles);

const Hello = (props) => (
  <div>
    <h2 className={styles.title}>{props.value}</h2>
    <button className={styles.submitButton}>Submit</button><br/>
    <button className={styles.grapeButton}>Grape</button><br/>
    <button className={styles.appleButton}>Apple</button><br/>
  </div>
);

Hello.propTypes = {
  value: React.PropTypes.string.isRequired
};

Hello.defaultProps = {
  value: 'Hello World'
};

export default Hello;
