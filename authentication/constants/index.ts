import { LoginSection } from 'authentication/containers/LoginSection';
import { RegistrationSection } from 'authentication/containers/RegistrationSection';
import React from 'react';

interface AuthSectionInterface {
    [path: string]: React.FC;
}

export const AUTH_SECTION: AuthSectionInterface = {
    '/masuk': LoginSection,
    '/daftar': RegistrationSection
};
