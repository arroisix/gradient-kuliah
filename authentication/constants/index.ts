import { LoginSection } from 'authentication/containers/LoginSection';
import { OnboardingSection } from 'authentication/containers/OnboardingSection';
import { EducationStep } from 'authentication/containers/OnboardingSection/EducationStep';
import { IdentityStep } from 'authentication/containers/OnboardingSection/IdentityStep';
import { PersonalDataStep } from 'authentication/containers/OnboardingSection/PersonalDataStep';
import { ReferenceStep } from 'authentication/containers/OnboardingSection/ReferenceStep';
import { RegistrationSection } from 'authentication/containers/RegistrationSection';
import React from 'react';

interface AuthSectionInterface {
    [path: string]: React.FC;
}

export const AUTH_SECTION: AuthSectionInterface = {
    '/masuk': LoginSection,
    '/registrasi': RegistrationSection,
    '/onboarding': OnboardingSection
};

export const ONBOARDING_STEP = [
    IdentityStep,
    PersonalDataStep,
    EducationStep,
    ReferenceStep
];
