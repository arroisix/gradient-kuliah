import { useContext } from 'react';
import RegistrationContext from 'authentication/contexts/RegistrationProvider';
import { ONBOARDING_STEP } from 'authentication/constants';
import { useSelector } from 'react-redux';
import { getIsProfileComplete } from 'authentication/redux/selectors/userSelector';
import { useGetProfileQuery } from 'authentication/redux/api/authApi';
import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import { EmailVerificationStep } from './EmailVerificationStep';
import { useLocalStorage } from 'usehooks-ts';
import { OnboardingStepper } from 'authentication/components/OnboardingStepper';

export const OnboardingSection = (): JSX.Element => {
    const isProfileComplete = useSelector(getIsProfileComplete);
    const { step } = useContext(RegistrationContext);
    const FormStep = ONBOARDING_STEP[step];
    const [showEmailVerification] = useLocalStorage(
        'showEmailVerification',
        false
    );
    const { data: profile, isLoading } = useGetProfileQuery({});

    if (isLoading) {
        return <LoadingBackdrop />;
    }

    if (isProfileComplete && showEmailVerification && profile?.email) {
        return <EmailVerificationStep />;
    } else {
        return (
            <div className="px-4 w-full flex flex-col items-center max-w-[739px]">
                <OnboardingStepper className="mb-[56px] mt-[24px]" />
                <div
                    id="form"
                    className="w-full flex flex-col gap-8 flex-grow items-center">
                    <FormStep />
                </div>
            </div>
        );
    }
};
