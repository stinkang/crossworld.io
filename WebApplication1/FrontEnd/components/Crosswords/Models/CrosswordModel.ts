﻿import {TestCrosswordClues} from "../../Compose/Models/TestCrosswordClues";
import {Solve} from "../../Solve/Models/Solve";

export class CrosswordModel {
    id: string;
    grid: string[][];
    clues: TestCrosswordClues[];
    author: string;
    title: string;
    isAnonymous: boolean;
    userId: string;
    
    constructor() {
        this.grid = [];
        this.id = "";
        this.clues = [];
        this.author = "";
        this.title = "";
        this.isAnonymous = false;
        this.userId = "";
    }
}