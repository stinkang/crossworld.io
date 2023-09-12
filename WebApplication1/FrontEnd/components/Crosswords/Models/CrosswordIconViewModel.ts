import {CrosswordModel} from "./CrosswordModel";
import {Solve} from "../../Solve/Models/Solve";
import {LeaderboardItemViewModel} from "./LeaderboardItemViewModel";

export class CrosswordIconViewModel {
    id: string;
    isAnonymous: boolean;
    userId: string;
    title: string;
    author: string;
    grid: string[][];
    solves: LeaderboardItemViewModel[];

    constructor() {
        this.grid = [];
        this.id = "";
        this.isAnonymous = false;
        this.userId = "";
        this.title = "";
        this.author = "";
        this.solves = [];
    }

    constructor(crosswordModel: CrosswordModel) {
        this.grid = crosswordModel.grid.map(row => row.map(cell => cell === '.' ? '.' : ''));
        this.author = crosswordModel.author;
        this.id = crosswordModel.id;
        this.isAnonymous = crosswordModel.isAnonymous;
        this.title = crosswordModel.title;
        this.userId = crosswordModel.userId;
        this.solves = [];
    }
}