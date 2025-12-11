import { useContext } from 'react';
import RegistrationContext from 'authentication/contexts/RegistrationProvider';
import { ONBOARDING_STEP } from 'authentication/constants';
import Button from 'commons/components/elements/Button';
import { FaChevronLeft } from 'react-icons/fa';
import { cn } from 'commons/utils';

type HandleStepperClickInterface = (index: number) => void;

export const OnboardingStepper = ({
    className
}: {
    className: string;
}): JSX.Element => {
    const { step, setStep } = useContext(RegistrationContext);
    const handleStepperClick: HandleStepperClickInterface = (index: number) => {
        if (index <= step) {
            setStep(index);
        }
    };

    return (
        <div
            className={cn(
                'flex gap-8 w-full items-center h-[44px]',
                className
            )}>
            {step > 0 ? (
                <Button
                    variant="secondary"
                    className="rounded-full w-[44px] h-[44px] !p-0 shrink-0 flex items-center justify-center"
                    onClick={() => setStep((prev) => prev - 1)}>
                    <FaChevronLeft size={20} />
                </Button>
            ) : null}
            <div className="flex w-full gap-2">
                {ONBOARDING_STEP.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleStepperClick(index)}
                        type="button"
                        className={`h-[4px] rounded-2xl w-full ${
                            step === index ? 'bg-[#B6A6F3]' : 'bg-violet-3'
                        }`}></button>
                ))}
            </div>
        </div>
    );
};
