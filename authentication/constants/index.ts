import { LoginSection } from 'authentication/containers/LoginSection';
import React from 'react';

interface AuthSectionInterface {
    [path: string]: React.FC;
}

export const AUTH_SECTION: AuthSectionInterface = {
    '/masuk': LoginSection
};
