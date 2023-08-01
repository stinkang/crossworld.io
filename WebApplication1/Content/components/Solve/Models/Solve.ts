import {CrosswordModel} from "../../Crosswords/Models/CrosswordModel";

export class Solve {
    millisecondsElapsed: number;
    crossword: CrosswordModel;
    solveGrid: string[][];
    isSolved: boolean;
    isCoOp: boolean;
    UsedHints: boolean;
    UserName: string;
    UserId: string;
}