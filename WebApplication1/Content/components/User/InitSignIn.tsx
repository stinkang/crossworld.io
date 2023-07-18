import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SignIn from './SignIn';

export const InitSignIn = () => {
    ReactDOM.render(
        <SignIn />,
        document.getElementById('signin-root')
    );
};