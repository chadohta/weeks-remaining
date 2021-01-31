import React, { Component } from 'react';
import '../styles/Home.css';
import GridNode from '../components/GridNode';
import LabelNode from '../components/LabelNode';
import { getPassedWeeks, validateUserInput } from '../helpers/helper-functions';

class Home extends Component {
    state = {
        grid: [],
        labels: [],
        weeksRemaining: 4160, // default = 80 years * 52 weeks per year
        predictedLifeSpan: 80,
    }

    componentDidMount() {
        let defaultLifeSpan = 80;
        this.createWeekLabels(defaultLifeSpan);
        this.createGrid(defaultLifeSpan);
        this.resetWeeksRemainingCount(defaultLifeSpan);
    }

    createWeekLabels(years) { 
        const labels = [];
        for (let row = 0; row < years; row++) {
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

    createGrid(years) {
        const grid = [];
        for (let row = 0; row < years; row++) {
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

    resetWeeksRemainingCount(years) { 
        this.setState({
            weeksRemaining: years * 52,
        });
    }

    setWeeksRemainingCount(years, n) { 
        this.setState({
            weeksRemaining: years * 52 - n,
        });
    }

    updatePredictedLifeSpan(lifeSpan) { 
        this.setState({
            predictedLifeSpan: lifeSpan,
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
        const { grid, predictedLifeSpan } = this.state;

        const lifeSpan = document.getElementById('lifeSpan').value;
        const birthday = document.getElementById('birthday').value; // YYYY-MM-DD string
        const dateParts = birthday.split('-');
        const bday = dateParts[1] + "/" + dateParts[2] + "/" + dateParts[0]; // MM/DD/YYYY string
        
        // validate user input first, returns if invalid
        if (!validateUserInput(bday, lifeSpan)) {
            this.toggleButtons(false);
            return;
        }

        // if user changes the predicated life span remake the grid
        if (lifeSpan !== predictedLifeSpan) { 
            this.createWeekLabels(lifeSpan);
            this.createGrid(lifeSpan);
            this.updatePredictedLifeSpan(lifeSpan);
            setTimeout(() => { this.resetGrid(); }, 500); // make sure state is updated with new grid
        } else { 
            this.resetGrid();
        }
        this.resetWeeksRemainingCount(lifeSpan);

        const weeksPassed = getPassedWeeks(grid, bday);
        setTimeout(() => { this.animateExploration(weeksPassed); }, 1000); // make sure grid is reset first 
        this.setWeeksRemainingCount(lifeSpan, weeksPassed.length);
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
                    <div>
                        <label for="bday"> <h2> Enter Your Birthday: </h2> </label>
                        <input type="date" id="birthday" name="bday" defaultValue="1990-01-01" min="1900-01-01" max="2020-12-31" required/>
                        <span className="validity"></span>
                    </div>
                    <div>
                        <label for="predictedLifeSpan"> <h3> Predicted Life Span (in years): </h3> </label>
                        <input type="number" id="lifeSpan" name="predictedLifeSpan" min="1" max="123" defaultValue="80" step="1" required/>
                        <span className="validity"></span>
                    </div>
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

                <p className="footer"> ** Default life span is based on the average human life span of 79 years (rounded to 80). </p>

            </div>
        );
    }
}
 
export default Home;