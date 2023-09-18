import Button from 'commons/components/elements/Button';
import { useState } from 'react';
import { ImOmega } from 'react-icons/im';
import { TbSquareRoot2 } from 'react-icons/tb';
import MathForm from './MathForm';
import SymbolForm from './SymbolForm';
import { posthog } from 'posthog-js';
import { FiPaperclip } from 'react-icons/fi';

type IconOption = {
    tag: keyof JSX.IntrinsicElements;
    icon: JSX.Element;
    tracker: string;
    disableClick?: boolean;
    disabled?: boolean;
    props?: Record<string, any>;
};

const ICON: IconOption[] = [
    {
        tag: 'div',
        icon: <TbSquareRoot2 className="text-[20px]" />,
        tracker: 'Click Latex Menu'
    },
    {
        tag: 'div',
        icon: <ImOmega className="text-[18px]" />,
        tracker: 'Click Symbol Menu'
    },
    {
        disabled: true,
        tag: 'label',
        icon: <FiPaperclip className="text-[18px] text-neutral-600" />,
        tracker: 'Click Attachment Menu',
        disableClick: true,
        props: {
            htmlFor: 'inputFile'
        }
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
                    {ICON.filter((opt) => !opt.disabled).map(
                        (
                            {
                                tag: Tag,
                                tracker,
                                icon,
                                disableClick,
                                props = {}
                            },
                            index
                        ) => (
                            <Tag
                                key={index}
                                className={`hidden md:block hover:bg-[#2C2C2C] px-[12px] py-[6px] rounded-[100px] cursor-pointer ${
                                    iconClicked === index
                                        ? 'text-white bg-[#2C2C2C]'
                                        : 'text-neutral-600'
                                }`}
                                onClick={() => {
                                    posthog.capture(tracker);
                                    if (!disableClick) {
                                        setIconClicked((prev) =>
                                            prev === index ? -1 : index
                                        );
                                    }
                                }}
                                aria-hidden
                                {...props}>
                                {icon}
                            </Tag>
                        )
                    )}
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
