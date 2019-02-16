import React, { Component } from 'react';

export default class KnockedPieces extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    let whitePieces = [];
    let redPieces = [];
    let totalCount = 0;
    let sideLength = 40;

    if (this.props.knocked.white > 0) {
      for (let i = 0; i < this.props.knocked.white; i++) {
        let style = {left: (totalCount * sideLength) + "px"}
        whitePieces.push(
          <svg key={totalCount} height={sideLength} width={sideLength} style={style}>
            <circle cx="20" cy="20" r="18" stroke="black" strokeWidth="2" fill="white" />
          </svg>
        )
        totalCount++;
      }
    }
    if (this.props.knocked.red > 0) {
      for (let i = 0; i < this.props.knocked.red; i++) {
        let style = {left: (totalCount * sideLength) + "px"}
        redPieces.push(
          <svg key={totalCount} height={sideLength} width={sideLength} style={style}>
            <circle cx="20" cy="20" r="18" stroke="black" strokeWidth="2" fill="red" />
          </svg>
        )
        totalCount++;
      }
    }

    let allPieces = whitePieces.concat(redPieces);

    return (
      <div onClick={this.props.moveIn} className="knocked-container">
        {allPieces}
      </div>
    );
  }
}