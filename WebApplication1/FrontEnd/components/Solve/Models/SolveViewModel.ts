export class SolveViewModel {
    solveId: string;
    crosswordId: number;
    solveGrid: string[][];
    isSolved: boolean;
    isCoOp: boolean;
    millisecondsElapsed: number;
    usedHints: boolean;
    testCrosswordAuthor: string;
    testCrosswordTitle: string;
    testCrosswordGrid: string[][];
    
    constructor() {
        this.solveId = "";
        this.crosswordId = 0;
        this.solveGrid = [];
        this.isSolved = false;
        this.isCoOp = false;
        this.millisecondsElapsed = 0;
        this.usedHints = false;
        this.testCrosswordAuthor = "";
        this.testCrosswordTitle = "";
        this.testCrosswordGrid = [];
    }
    
}
