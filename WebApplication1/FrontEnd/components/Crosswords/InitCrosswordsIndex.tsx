import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {CrosswordsIndex} from "./CrosswordsIndex";
import { CrosswordsIndexOptions } from "./CrosswordsIndex";

export const InitCrosswordsIndex = (options: CrosswordsIndexOptions) => {
    ReactDOM.render(
        <CrosswordsIndex crosswords={options.crosswords} isLoggedIn={options.isLoggedIn} />,
        document.getElementById('crosswords-index-root')
    );
};
