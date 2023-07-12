import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Compose from "./Compose";

export const InitCompose = () => {
    ReactDOM.render(
        <Compose />,
        document.getElementById('compose-root')
    );
};