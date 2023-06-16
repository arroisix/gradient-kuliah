import { MouseEventHandler } from 'react';
import { MdHelp } from 'react-icons/md';

interface TutorButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>;
}

const TutorButton = ({ onClick }: TutorButtonProps): JSX.Element => {
    return (
        <button
            onClick={onClick}
            className="flex justify-between items-center w-screen md:w-[400px] p-4 rounded-t-lg bg-accent-purple shadow-md cursor-pointer cursor-pointer">
            <h3 className="text-base sm:text-xl md:text-2xl font-bold">
                Bingung? Coba tanya tutor
            </h3>
            <MdHelp className="text-3xl animate-pulse" />
        </button>
    );
};

export default TutorButton;
