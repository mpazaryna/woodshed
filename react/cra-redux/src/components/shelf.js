import React, { Component } from "react";

// class component with all the functionality that React offers

class Shelf extends Component {
  constructor(props) {
    super(props);
    this.onAddItemToCart = this.onAddItemToCart.bind(this);
    this.state = {
      shelfItems: ["chocolate", "yogurt", "granola"]
    };
  }
  onAddItemToCart(item) {
    this.props.addItem(item);
  }
  render() {
    const shelfItems = this.state.shelfItems.map((item, idx) => {
      return (
        <li key={idx}>
          <button onClick={() => this.onAddItemToCart(item)}>[+]</button>{item}
        </li>
      );
    });
    return (
      <div>
        <h2>Store Shelf:</h2>
        <ul>
          {shelfItems}
        </ul>
      </div>
    );
  }
}

export default Shelf;
