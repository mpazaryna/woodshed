import React from 'react';


const styles = {
  main: {
    top: 150,
    margin: 75,
    maxWidth: 600
  }
};


const SampleCard = ({}) => {
  return (
    <div style={styles.main}>
      <div className="container">
        <div className="card">
          <img className="img-fluid" src="https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20%282%29.jpg" alt="Card image cap" />
            <div className="card-block">
              <h4 className="card-title">Card title</h4>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" className="btn btn-primary">Button</a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SampleCard;
