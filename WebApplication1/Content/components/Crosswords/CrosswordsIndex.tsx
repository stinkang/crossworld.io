import React from 'react';
import {CrosswordIcon} from "./CrosswordIcon";
import {CrosswordIconViewModel} from "./Models/CrosswordIconViewModel";

export interface CrosswordsIndexOptions {
    crosswords: CrosswordIconViewModel[];
}

export function CrosswordsIndex(props: CrosswordsIndexOptions) {
    return (
        <div>
            <ul>
                { props.crosswords.map(crossword =>
                    <div>
                        <CrosswordIcon author={crossword.author} id={crossword.id} title={crossword.title} grid={crossword.grid} />
                        &nbsp;
                    </div>
                )}
            </ul>
        </div>
    );
}