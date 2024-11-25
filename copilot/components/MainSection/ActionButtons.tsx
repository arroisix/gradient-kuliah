import { BsQuestionCircleFill } from 'react-icons/bs';
import { BiSolidCamera } from 'react-icons/bi';

const ActionButtons = (): JSX.Element => {
    return (
        <div className="flex gap-4">
            <button className="flex flex-col items-center gap-2 bg-neutral-800 px-6 py-3 rounded-lg">
                <BsQuestionCircleFill className="text-[#9747FF]" size={20} />
                <span className="font-medium">Tanya Soal</span>
            </button>
            <button className="flex flex-col items-center gap-2 bg-neutral-800 px-6 py-3 rounded-lg">
                <BiSolidCamera className="text-[#5D75FF]" size={20} />
                <span className="font-medium">Scan Foto Soal</span>
            </button>
        </div>
    );
};

export default ActionButtons;
