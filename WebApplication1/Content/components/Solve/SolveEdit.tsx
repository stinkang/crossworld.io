import React from "react";
import {SolveViewModel} from "./Models/SolveViewModel";
import Play from "../../pages/Play";

export const SolveEdit = (props) => {
    return (
        <Play solveId={props.solveId} crosswordId={props.crosswordId} />
    );
};