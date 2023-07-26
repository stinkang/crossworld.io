import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {SolveGame} from "./SolveGame";

export const InitSolveGame = (options) => {
    ReactDOM.render(
        <SolveGame solveId = {options} />,
        document.getElementById('solve-game-root')
    );
};