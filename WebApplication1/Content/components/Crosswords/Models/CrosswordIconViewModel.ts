export class CrosswordIconViewModel {
    id: string;
    author: string;
    title: string;
    grid: string[][];

    constructor() {
        this.grid = [];
        this.id = "";
        this.author = "";
        this.title = "";
    }
}