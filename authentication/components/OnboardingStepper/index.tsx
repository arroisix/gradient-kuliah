import { useContext } from 'react';
import RegistrationContext from 'authentication/contexts/RegistrationProvider';
import { ONBOARDING_STEP } from 'authentication/constants';

type HandleStepperClickInterface = (index: number) => void;

export const OnboardingStepper = (): JSX.Element => {
    const { step, setStep } = useContext(RegistrationContext);
    const handleStepperClick: HandleStepperClickInterface = (index: number) => {
        if (index <= step) {
            setStep(index);
        }
    };

    return (
        <div className="flex w-full gap-2">
            {ONBOARDING_STEP.map((_, index) => (
                <div
                    key={index}
                    className="h-[4px]"
                    style={{
                        width: `${(1 / ONBOARDING_STEP.length) * 100}%`
                    }}>
                    <button
                        onClick={() => handleStepperClick(index)}
                        type="button"
                        className={`h-[4px] rounded-2xl w-full ${
                            step === index ? 'bg-[#333333]' : 'bg-[#1D1D1D]'
                        }`}
                    ></button>
                </div>
            ))}
        </div>
    );
};
