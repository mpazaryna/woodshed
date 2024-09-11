import React from 'react';


const styles = {
  main: {
    top: 150,
    margin: 75,
    maxWidth: 600
  }
};

const SampleFlex = ({}) => {
  return (
    <div style={styles.main}>
      <div className="container">
        <div className="d-flex justify-content-between grey lighten-3">
          <div className="primary-color text-center flex-example flex-last">First Item</div>
          <div className="red darken-2 text-center flex-example">Second Item</div>
          <div className="amber lighten-1 text-center flex-example flex-first">Third Item</div>
        </div>
      </div>
    </div>
  );
};

export default SampleFlex;




