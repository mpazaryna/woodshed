import PropTypes from 'prop-types';
import React from 'react';

export default function Hello(props) {
  const { title } = props;
  return (
    <h2>{ title }</h2>
  );
}

Hello.propTypes = {
  title: PropTypes.string.isRequired,
};
