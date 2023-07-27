import React from "react";
import Game from "../../pages/Game";

export const SolveGame = (props) => {
    return (
        <Game solveId={props.solveId} userName={props.userName}/>
    );
};