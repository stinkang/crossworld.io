export class LeaderboardItemViewModel {
    //isCoOp: boolean;
    millisecondsElapsed: number;
    //usedHints: boolean;
    userId: string;
    userName: string;
    isSolved: boolean;

    constructor() {
        //this.isCoOp = false;
        this.millisecondsElapsed = 0;
        //this.usedHints = false;
        this.userId = "";
        this.userName = "";
        this.isSolved = false;
    }
}
