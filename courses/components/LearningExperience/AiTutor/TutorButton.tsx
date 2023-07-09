import Copilot from 'commons/components/elements/Icons/Copilot';
import { MouseEventHandler } from 'react';

interface TutorButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>;
}

const TutorButton = ({ onClick }: TutorButtonProps): JSX.Element => {
    return (
        <button
            onClick={onClick}
            className="w-max flex justify-between items-center gap-[14px] md:gap-[10px] py-[9px] md:py-[6px] px-[14px] rounded-[100px] bg-accent-purple shadow-md cursor-pointer">
            <h3 className="font-extrabold text-sm md:text-xs">
                Bingung? tanya Copilot
            </h3>
            <Copilot />
        </button>
    );
};

export default TutorButton;
