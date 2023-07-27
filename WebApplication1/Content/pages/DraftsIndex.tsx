import React from 'react';
import ReactDOM from 'react-dom';
import { DraftsIndexDraftViewModel } from "../components/Compose/Models/DraftsIndexDraftViewModel";
import {DraftIcon} from "./DraftIcon";
import Compose from "./Compose";

export interface DraftsIndexOptions {
    drafts: DraftsIndexDraftViewModel[];
}

export function DraftsIndex(props: DraftsIndexOptions) {
    return (
        <div>
            <Compose />
            &nbsp;
            <ul>
                { props.drafts.map(draft =>
                    <div>
                        <DraftIcon id={draft.id} title={draft.title} grid={draft.grid} />
                        &nbsp;
                        &nbsp;
                    </div>
                )}
            </ul>
        </div>
    );
}