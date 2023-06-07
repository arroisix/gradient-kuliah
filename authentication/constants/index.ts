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

export const EDUCATION_OPTIONS = [
    {
        key: '',
        value: 'Pilih pendidikan'
    },
    {
        key: 'SMP',
        value: 'SMP'
    },
    {
        key: 'SMA',
        value: 'SMA'
    },
    {
        key: 'SMK',
        value: 'SMK'
    },
    {
        key: 'S1',
        value: 'Sarjana'
    },
    {
        key: 'S2',
        value: 'Magister'
    },
    {
        key: 'S3',
        value: 'Doktor'
    }
];

export const PROFESSION_OPTIONS = [
    {
        key: '',
        value: 'Pilih pekerjaan'
    },
    {
        key: 'student',
        value: 'Pelajar/Mahasiswa'
    },
    {
        key: 'employed',
        value: 'Bekerja'
    },
    {
        key: 'fresh_grad',
        value: 'Fresh Graduate'
    },
    {
        key: 'unemployed',
        value: 'Tidak Bekerja'
    }
];
