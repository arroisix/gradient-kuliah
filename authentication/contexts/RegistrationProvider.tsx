import { useUpdateUserMutation } from 'authentication/redux/api/authApi';
import { createContext, ReactNode, useMemo, useState } from 'react';
import { useTracker } from 'tracker/tracker';

interface RegistrationContextType {
    updateUser: (data: UpdateUserInputData) => Promise<void>;
    formData: UpdateUserInputData;
    setFormData: (data: UpdateUserInputData) => void;
    step: number;
    setStep: (step: number) => void;
    isUserUpdateLoading: boolean;
    isUserUpdateSuccess: boolean;
}

const RegistrationContext = createContext<RegistrationContextType>(
    {} as RegistrationContextType
);

interface Props {
    children: ReactNode;
}

export const RegistrationProvider: React.FC<Props> = ({ children }) => {
    const [update, { isLoading, isSuccess }] = useUpdateUserMutation();
    const [formData, setFormData] = useState({} as UpdateUserInputData);
    const [step, setStep] = useState(0);
    const tracker = useTracker();

    const memoedValue = useMemo(
        () => ({
            updateUser: async (data: UpdateUserInputData) => {
                tracker?.trackAttemptFormSubmit(
                    'Submit Onboarding Data',
                    { ...data },
                    { Step: step }
                );
                setFormData(data);
                await update(data);
            },
            isUserUpdateLoading: isLoading,
            isUserUpdateSuccess: isSuccess,
            step,
            setStep,
            formData,
            setFormData
        }),
        [formData, setFormData, step, setStep, update, isLoading, isSuccess]
    );

    return (
        <RegistrationContext.Provider value={memoedValue}>
            {children}
        </RegistrationContext.Provider>
    );
};

export default RegistrationContext;
