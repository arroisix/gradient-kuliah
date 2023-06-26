import { useContext } from 'react';
import RegistrationContext from 'authentication/contexts/RegistrationProvider';
import { ONBOARDING_STEP } from 'authentication/constants';
import { OnboardingStepper } from 'authentication/components/OnboardingStepper';
import { OnboardingSuccess } from './OnboardingSuccess';
import { useSelector } from 'react-redux';
import { getIsProfileComplete } from 'authentication/redux/selectors/userSelector';

export const OnboardingSection = (): JSX.Element => {
    const isProfileComplete = useSelector(getIsProfileComplete);
    const { step, isUserUpdateLoading, isUserUpdateSuccess } =
        useContext(RegistrationContext);
    const FormStep = ONBOARDING_STEP[step];

    return (
        <>
            {(!isUserUpdateLoading && isUserUpdateSuccess) ||
            isProfileComplete ? (
                <OnboardingSuccess />
            ) : (
                <div
                    className={`w-[280px] md:w-[360px] flex flex-col gap-8 justify-center items-center`}>
                    <h1 className="w-full text-3xl font-extrabold">
                        Lengkapi akunmu
                    </h1>
                    <FormStep />
                    <OnboardingStepper />
                </div>
            )}
        </>
    );
};
