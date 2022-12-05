import React, { Component } from 'react';
import '../styles/LabelNode.css'

class LabelNode extends Component {
    render() { 
        const { col, row, hide } = this.props;
        const extraClassName = hide ? 'label-hide' : '';
        
        return ( 
            <div
                id={`label-${row}-${col}`}
                className={`label-node ${extraClassName}`}> {row}
            </div>
        );
    }
}
 
export default LabelNode;