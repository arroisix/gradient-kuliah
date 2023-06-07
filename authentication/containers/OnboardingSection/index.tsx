import { useContext, useEffect, useState } from 'react';
import RegistrationContext from 'authentication/contexts/RegistrationProvider';
import { ONBOARDING_STEP } from 'authentication/constants';
import DialogSuccess from 'authentication/components/SuccessDialog';
import { OnboardingStepper } from 'authentication/components/OnboardingStepper';

export const OnboardingSection = (): JSX.Element => {
    const [success, setSuccess] = useState<1 | 0>(0);
    const { step, isUserUpdateLoading, isUserUpdateSuccess } =
        useContext(RegistrationContext);
    const FormStep = ONBOARDING_STEP[step];

    useEffect(() => {
        if (!isUserUpdateLoading && isUserUpdateSuccess) {
            setSuccess(1);
        }
    }, [isUserUpdateLoading, isUserUpdateSuccess]);

    return (
        <>
            <FormStep />
            <OnboardingStepper />
            <DialogSuccess isOpen={success} setOpen={setSuccess} />
        </>
    );
};
