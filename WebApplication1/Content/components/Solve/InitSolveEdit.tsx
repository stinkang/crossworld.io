import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {SolveViewModel} from "./Models/SolveViewModel";
import {SolveEdit} from "./SolveEdit";

export const InitSolveEdit = (options: SolveViewModel) => {
    ReactDOM.render(
        <SolveEdit 
            solveId = {options.solveId}
            crosswordId  ={options.crosswordId}
            // solveGrid = {options.solveGrid}
            // isSolved = {options.isSolved}
            // isCoOp = {options.isCoOp}
            // millisecondsElapsed = {options.millisecondsElapsed}
            // usedHints = {options.usedHints}
            // testCrosswordAuthor = {options.testCrosswordAuthor}
            // testCrosswordTitle = {options.testCrosswordTitle}
            // testCrosswordGrid = {options.testCrosswordGrid}
        />,
        document.getElementById('solve-edit-root')
    );
};