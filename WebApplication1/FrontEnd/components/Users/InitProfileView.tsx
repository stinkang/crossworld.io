import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ProfileView } from "./ProfileView";
import { ProfileViewProps } from "./ProfileView";

export const InitProfileView = (options: ProfileViewProps) => {
    ReactDOM.render(
        <ProfileView {...options} />,
    document.getElementById('profile-view-root')
    );
};
