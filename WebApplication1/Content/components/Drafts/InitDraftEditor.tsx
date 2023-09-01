import * as React from 'react';
import * as ReactDOM from 'react-dom';
import DraftEditor from "./DraftEditor";
import {TestCrosswordClues} from "./Models/TestCrosswordClues";

export interface InitDraftEditorOptions {
    id: string;
    initialTitle: string;
    initialClues: TestCrosswordClues;
    initialGrid: string[][];
}

export const InitDraftEditor = (options: InitDraftEditorOptions) => {
    ReactDOM.render(
        <DraftEditor {...options} />,
        document.getElementById('draft-editor-root')
    );
};
