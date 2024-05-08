import React from "react";

const styles = {
  main: {
    top: 250,
    margin: 75,
    maxWidth: 600
  }
};


const QuotesTable = ({}) => {
  return (
    
  <div style={styles.main}>  
    
    
 <div className="container">
<table className="table table-striped">
  <thead>
    <tr>
      <th>#</th>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Username</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
</div>

</div>


  );
};


export default QuotesTable;
