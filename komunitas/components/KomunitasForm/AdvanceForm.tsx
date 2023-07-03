import Button from 'commons/components/elements/Button';
import { useState } from 'react';
import { FiPaperclip } from 'react-icons/fi';
import { ImOmega } from 'react-icons/im';
import { TbSquareRoot2 } from 'react-icons/tb';
import MathForm from './MathForm';
import SymbolForm from './SymbolForm';

const ICON = [
    {
        icon: <TbSquareRoot2 className="text-[20px]" />
    },
    {
        icon: <ImOmega className="text-[18px]" />
    }
];

const AdvanceForm = ({
    setFormContent,
    formRef,
    handleSubmit,
    cancelButton,
    submitButtonText
}: {
    setFormContent: React.Dispatch<React.SetStateAction<string>>;
    formRef: React.RefObject<HTMLTextAreaElement>;
    handleSubmit: () => Promise<void>;
    cancelButton?: () => void;
    submitButtonText: JSX.Element | string;
}): JSX.Element => {
    const [iconClicked, setIconClicked] = useState(-1);

    return (
        <div className="bg-[#242424] px-5 py-[10px] rounded-b-[20px]">
            <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    {ICON.map((value, index) => (
                        <div
                            key={index}
                            className={`hidden md:block hover:bg-[#2C2C2C] px-[12px] py-[6px] rounded-[100px] cursor-pointer ${
                                iconClicked === index
                                    ? 'text-white bg-[#2C2C2C]'
                                    : 'text-neutral-600'
                            }`}
                            onClick={() =>
                                setIconClicked((prev) =>
                                    prev === index ? -1 : index
                                )
                            }
                            aria-hidden>
                            {value.icon}
                        </div>
                    ))}
                    <label
                        htmlFor={'inputFile'}
                        className="block hover:bg-[#2C2C2C] px-[12px] py-[6px] rounded-[100px] cursor-pointer">
                        <FiPaperclip className="text-[18px] text-neutral-600" />
                    </label>
                </div>
                {iconClicked === -1 && (
                    <div className="flex gap-2">
                        <Button
                            variant="custom"
                            className="text-neutral-600 font-extrabold text-xs px-[10px]"
                            onClick={cancelButton}>
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            className="font-extrabold text-xs px-[17px]"
                            onClick={handleSubmit}>
                            {submitButtonText}
                        </Button>
                    </div>
                )}
            </div>
            {iconClicked === 0 && <MathForm setFormContent={setFormContent} />}
            {iconClicked === 1 && (
                <SymbolForm setFormContent={setFormContent} formRef={formRef} />
            )}
            {iconClicked !== -1 && (
                <div className="flex gap-2 justify-end pb-[10px]">
                    <Button
                        variant="custom"
                        className="text-neutral-600 font-extrabold text-xs px-[10px]"
                        onClick={cancelButton}>
                        Batal
                    </Button>
                    <Button
                        variant="primary"
                        className="font-extrabold text-xs px-[17px]"
                        onClick={handleSubmit}>
                        {submitButtonText}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AdvanceForm;
