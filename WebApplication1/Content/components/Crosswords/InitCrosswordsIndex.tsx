import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {CrosswordsIndex} from "./CrosswordsIndex";
import { CrosswordsIndexOptions } from "./CrosswordsIndex";

export const InitCrosswordsIndex = (options: CrosswordsIndexOptions) => {
    ReactDOM.render(
        <CrosswordsIndex crosswords={options.crosswords} />,
        document.getElementById('crosswords-index-root')
    );
};
