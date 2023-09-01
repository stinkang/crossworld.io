export class DraftsIndexDraftViewModel {
    id: string;
    title: string;
    grid: string[][];

    constructor() {
        this.grid = [];
        this.id = "";
        this.title = "";
    }
}