import React from 'react';

// presentational component ightweight functions to return whatever the DOM looks like
// purpose: How things look (markup, styles)
// aware of flux: No
// to read data: Read data from props
// to change data: Invoke callbacks from props

const About = ({ name, author, version }) => (
  <div className="about">
    <h2>About: {name} </h2>
    <h3>Written by: {author} </h3>
    <h3>version: {version} </h3>
  </div>
);

About.propTypes = {
  name: React.PropTypes.string.isRequired,
  author: React.PropTypes.string.isRequired,
  version: React.PropTypes.string.isRequired
};

export default About;
