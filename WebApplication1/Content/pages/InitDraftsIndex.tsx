import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DraftsIndexDraftViewModel } from "../components/Compose/Models/DraftsIndexDraftViewModel";
import { DraftsIndexOptions, DraftsIndex } from "./DraftsIndex";

export const InitDraftsIndex = (options: DraftsIndexOptions) => {
    ReactDOM.render(
        <DraftsIndex drafts={options.drafts} />,
        document.getElementById('drafts-index-root')
    );
};