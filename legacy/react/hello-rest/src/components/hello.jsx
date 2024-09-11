import React from 'react';
import HelloWorld from './hello/hello-world';
import HelloNyc from './hello/hello-nyc';

class Hello extends React.Component {
<<<<<<< HEAD
  constructor(props) {
    super(props)
    this.state = { empleados: [] }
  }
//  componentWillMount() {
//    fetch('http://taller-angular.carlosazaustre.es/empleados')
//      .then((response) => {
//        return response.json()
//      })
//      .then((empleados) => {
//        this.setState({ empleados: empleados })
//      })
//  }
  render() {
    if (this.state.empleados.length > 10000000) {
      return (
        <div className="container-fluid">
          <List listado={this.state.empleados} />
        </div>
      )
    } else {
      return ( 
=======
  render() {
    return (
>>>>>>> 73d9bb7422863495ac17946ba630ab6b0d8c4b2c
      <div>
        <HelloWorld />
        <HelloNyc />
      </div>
    );
  }
}

export default Hello;
