import React from 'react';
import {CrosswordIcon} from "./CrosswordIcon";
import {CrosswordIconViewModel} from "./Models/CrosswordIconViewModel";
import './css/crosswords.css';

export interface CrosswordsIndexOptions {
    crosswords: CrosswordIconViewModel[];
}

export function CrosswordsIndex(props: CrosswordsIndexOptions) {
    return (
        <div className="grid-container">
            { props.crosswords.map(crossword =>
                <div className="grid-item">
                    <CrosswordIcon
                        author={crossword.author} 
                        id={crossword.id}
                        title={crossword.title}
                        grid={crossword.grid}
                        userId={crossword.userId}
                        isAnonymous={crossword.isAnonymous}
                    />
                </div>
            )}
        </div>
    );
}