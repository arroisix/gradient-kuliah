// import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { useUpdateUserMutation } from 'authentication/redux/api/authApi';
import { createContext, ReactNode, useMemo, useState } from 'react';

interface RegistrationContextType {
    updateUser: ReturnType<typeof useUpdateUserMutation>[0];
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

    const memoedValue = useMemo(
        () => ({
            updateUser: update,
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
