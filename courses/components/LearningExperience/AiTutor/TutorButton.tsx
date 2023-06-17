import Copilot from 'commons/components/elements/Icons/Copilot';
import { MouseEventHandler } from 'react';

interface TutorButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>;
}

const TutorButton = ({ onClick }: TutorButtonProps): JSX.Element => {
    return (
        <button
            onClick={onClick}
            className="flex justify-between items-center w-screen md:w-[400px] py-4 px-3 rounded-t-lg bg-accent-purple shadow-md cursor-pointer cursor-pointer">
            <h3 className="text-base sm:text-xl md:text-2xl font-bold">
                Bingung? tanya Copilot
            </h3>
            <Copilot />
        </button>
    );
};

export default TutorButton;
