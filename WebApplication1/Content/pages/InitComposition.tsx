import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Composition from "./Composition";

export const InitComposition = (cid: number) => {
    ReactDOM.render(
        <Composition cid={cid} />,
        document.getElementById('composition-root')
    );
};
