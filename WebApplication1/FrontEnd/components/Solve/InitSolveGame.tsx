import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {SolveGame} from "./SolveGame";

export const InitSolveGame = (solveId, userName) => {
    ReactDOM.render(
        <SolveGame solveId = {solveId} userName = {userName} />,
        document.getElementById('solve-game-root')
    );
};