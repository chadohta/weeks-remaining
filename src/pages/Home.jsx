import React, { Component } from 'react';
import '../styles/Home.css';
import GridNode from '../components/GridNode';
import LabelNode from '../components/LabelNode';
import { getPassedWeeks } from '../helpers/helper-functions';

class Home extends Component {
    state = {
        grid: [],
        labels: [],
        weeksRemaining: 4160, // 80 years * 52 weeks per year
    }

    componentDidMount() {
        this.createWeekLabels();
        this.createGrid();
    }

    createWeekLabels() { 
        const labels = [];
        for (let row = 0; row < 80; row++) {
            const currentRow = [];
            for (let col = 0; col < 1; col++) {
                currentRow.push(this.createLabel(col, row));
            }
            labels.push(currentRow);
        }
        this.setState({
            labels: labels,
        });
    }

    createLabel(col, row) { 
        const hide = row % 5 !== 0 ? true : false;
        return {
            col: col,
            row: row,
            hide: hide,
        };
    }

    createGrid() {
        const grid = [];
        for (let row = 0; row < 80; row++) {
            const currentRow = [];
            for (let col = 0; col < 52; col++) {
                currentRow.push(this.createNode(col, row));
            }
            grid.push(currentRow);
        }
        this.setState({
            grid: grid,
        });
    }

    createNode(col, row) {
        return {
            col: col,
            row: row,
        };
    }

    resetGrid() { 
        const allNodes = [];
        for (const row of this.state.grid) {
            for (const node of row) {
                allNodes.push(node);
            }
        }
        for (let i = 0; i < allNodes.length; i++) {
            setTimeout(() => {
                const node = allNodes[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
            }, 1 * i);
        }
    }

    resetWeeksRemainingCount() { 
        this.setState({
            weeksRemaining: 4160,
        });
    }

    setWeeksRemainingCount(n) { 
        this.setState({
            weeksRemaining: 4160 - n,
        });
    }

    toggleButtons(booleanLock) { 
        const buttons = document.querySelectorAll('button');
        buttons.forEach((button) => {
            button.disabled = booleanLock;
        });
    }

    handleBirthdaySubmit() { 
        this.toggleButtons(true);
        this.resetGrid();
        this.resetWeeksRemainingCount();

        const birthday = document.getElementById('birthday').value; // YYYY-MM-DD string
        const dateParts = birthday.split('-');
        const bday = dateParts[1] + "/" + dateParts[2] + "/" + dateParts[0]; // MM/DD/YYYY string

        const { grid } = this.state;
        const weeksPassed = getPassedWeeks(grid, bday);
        this.animateExploration(weeksPassed);
        this.setWeeksRemainingCount(weeksPassed.length);
    }

    animateExploration(weeksPassed) {
        for (let i = 0; i < weeksPassed.length; i++) {
            setTimeout(() => {
                const node = weeksPassed[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-passed';
            }, 5 * i);
        }
        setTimeout(() => {
            this.toggleButtons(false);
        }, weeksPassed.length * 5);
    }

    render() { 
        const { grid, labels, weeksRemaining } = this.state;

        return ( 
            <div>
                <div className="input-container">
                    <label>
                        <h2> Enter Your Birthday: </h2>
                        <input type="date" id="birthday" defaultValue="1990-01-01" min="1900-01-01" max="2020-12-31" required/>
                        <span className="validity"></span>
                    </label>
                    <button className="birthdaySubmit" onClick={() => this.handleBirthdaySubmit()}> Submit </button>
                    <hr/>
                </div>

                <div className="container">
                    <h1> {weeksRemaining} <span className="remaining-text"> weeks remaining </span> </h1>

                    <div className="labels">
                        {labels.map((row, rIndex) => {
                            return (
                                <div key={rIndex}>
                                    {row.map((node, nIndex) => {
                                        const { row, col, hide } = node;
                                        return (
                                            <LabelNode
                                                key={nIndex}
                                                col={col}
                                                row={row}
                                                hide={hide}>
                                            </LabelNode>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                    <div className="grid">
                        {grid.map((row, rIndex) => {
                            return (
                                <div key={rIndex}>
                                    {row.map((node, nIndex) => {
                                        const { row, col } = node;
                                        return (
                                            <GridNode
                                                key={nIndex}
                                                col={col}
                                                row={row}>
                                            </GridNode>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <p className="footer"> ** Weeks remaining is based on the average human life span of 79 years (rounded to 80). </p>

            </div>
        );
    }
}
 
export default Home;