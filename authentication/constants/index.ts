import { LoginSection } from 'authentication/containers/LoginSection';
import { OnboardingSection } from 'authentication/containers/OnboardingSection';
import { EducationStep } from 'authentication/containers/OnboardingSection/EducationStep';
import { IdentityStep } from 'authentication/containers/OnboardingSection/IdentityStep';
import { PersonalDataStep } from 'authentication/containers/OnboardingSection/PersonalDataStep';
import { ReferenceStep } from 'authentication/containers/OnboardingSection/ReferenceStep';
import { RegistrationSection } from 'authentication/containers/RegistrationSection';
import React from 'react';
import { GroupBase } from 'react-select';

interface AuthSectionInterface {
    [path: string]: React.FC;
}

export const AUTH_SECTION: AuthSectionInterface = {
    '/masuk': LoginSection,
    '/daftar': RegistrationSection,
    '/onboarding': OnboardingSection
};

export const ONBOARDING_STEP = [
    IdentityStep,
    PersonalDataStep,
    EducationStep,
    ReferenceStep
];

export const EDUCATION_OPTIONS = [
    {
        value: 'SMP',
        label: 'SMP'
    },
    {
        value: 'SMA',
        label: 'SMA'
    },
    {
        value: 'SMK',
        label: 'SMK'
    },
    {
        value: 'S1',
        label: 'Sarjana'
    },
    {
        value: 'S2',
        label: 'Magister'
    },
    {
        value: 'S3',
        label: 'Doktor'
    }
];

export const PROFESSION_OPTIONS = [
    {
        value: 'student',
        label: 'Pelajar/Mahasiswa'
    },
    {
        value: 'employed',
        label: 'Bekerja'
    },
    {
        value: 'fresh_grad',
        label: 'Fresh Graduate'
    },
    {
        value: 'unemployed',
        label: 'Tidak Bekerja'
    }
];
