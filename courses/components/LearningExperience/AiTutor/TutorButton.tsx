import { MouseEventHandler } from 'react';
import { MdChat } from 'react-icons/md';

interface TutorButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>;
}

const TutorButton = ({ onClick }: TutorButtonProps): JSX.Element => {
    return (
        <button
            onClick={onClick}
            className="flex justify-between items-center w-[30vw] p-4 rounded-t-lg bg-accent-purple shadow-md cursor-pointer">
            <h3 className="text-2xl font-bold">Gradient AI Tutor (alpha)</h3>
            <MdChat className="text-3xl animate-pulse" />
        </button>
    );
};

export default TutorButton;
