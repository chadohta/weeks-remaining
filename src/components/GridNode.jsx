import React, { Component } from 'react';
import '../styles/GridNode.css'

class GridNode extends Component {
    render() { 
        const { col, row } = this.props;
        
        return ( 
            <div
                id={`node-${row}-${col}`}
                className={`node`}>
            </div>
        );
    }
}
 
export default GridNode;