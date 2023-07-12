import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Composition from "./Composition";

export interface InitCompositionOptions {
    cid: number;
};

export const InitComposition = (options: InitCompositionOptions) => {
    ReactDOM.render(
        <Composition cid={options.cid} />,
        document.getElementById('composition-root')
    );
};
