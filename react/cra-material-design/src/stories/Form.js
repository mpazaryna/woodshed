import React from 'react';

const styles = {
  main: {
    top: 250,
    margin: 75,
    maxWidth: 600
  }
};

const Form = ({}) => {
  return (
    <div style={styles.main}>
    <div className="container">
      <div className="card">
        <div className="card-block">
          <div className="form-header purple darken-4">
            <h3><i class="fa fa-lock"></i> Login:</h3>
          </div>
          <div className="md-form">
            <i class="fa fa-envelope prefix"></i>
            <input type="text" id="form2" class="form-control"/>
            <label for="form2">Your email</label>
          </div>
          <div className="md-form">
            <i class="fa fa-lock prefix"></i>
            <input type="password" id="form4" class="form-control"/>
            <label for="form4">Your password</label>
          </div>
          <div className="text-center">
            <button className="btn btn-deep-purple">Login</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Form;
