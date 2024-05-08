/**
 * presentational component lightweight functions to return whatever the DOM looks like
 * purpose: How things look (markup, styles)
 * aware of flux: No
 * to read data: Read data from props
 * to change data: Invoke callbacks from props
 * Abstract this wherever in your build process
 * There could be logic here.
 */

import React from 'react';

const About = ({ name }) => (
  <div className="about">
    <div>
      <h1>{name}</h1>
    </div>
  </div>
);

About.propTypes = {
  name: React.PropTypes.string.isRequired
};

export default About;
