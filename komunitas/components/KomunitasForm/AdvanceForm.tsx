import Button from 'commons/components/elements/Button';
import { useMemo, useState } from 'react';
import { ImOmega } from 'react-icons/im';
import { TbSquareRoot2 } from 'react-icons/tb';
import MathForm from './MathForm';
import SymbolForm from './SymbolForm';
import { FiPaperclip } from 'react-icons/fi';
import { useTracker } from 'tracker/tracker';

type IconOption = {
    tag: keyof JSX.IntrinsicElements;
    icon: JSX.Element;
    tracker: string;
    disableClick?: boolean;
    disabled?: boolean;
    props?: Record<string, any>;
};

type AdvanceFormProps = {
    setFormContent: React.Dispatch<React.SetStateAction<string>>;
    formRef: React.RefObject<HTMLTextAreaElement>;
    handleSubmit: () => Promise<void>;
    cancelButton?: () => void;
    submitButtonText: JSX.Element | string;
    isLoading?: boolean;
    context: 'q' | 'a';
};

const AdvanceForm = ({
    setFormContent,
    formRef,
    handleSubmit,
    cancelButton,
    submitButtonText,
    isLoading,
    context
}: AdvanceFormProps): JSX.Element => {
    const ICON: IconOption[] = useMemo(
        () => [
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
                disabled: context === 'q',
                tag: 'label',
                icon: <FiPaperclip className="text-[18px] text-neutral-600" />,
                tracker: 'Click Attachment Menu',
                disableClick: true,
                props: {
                    htmlFor: 'inputFile'
                }
            }
        ],
        [context]
    );

    const [iconClicked, setIconClicked] = useState(-1);
    const tracker = useTracker();

    return (
        <div className="bg-[#242424] px-5 py-[10px] rounded-b-[20px]">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {ICON.filter((opt) => !opt.disabled).map(
                        (
                            {
                                tag: Tag,
                                tracker: trackerEvent,
                                icon,
                                disableClick,
                                props = {}
                            },
                            index
                        ) => (
                            <Tag
                                key={index}
                                className={`block hover:bg-[#2C2C2C] px-[12px] py-[6px] rounded-[100px] cursor-pointer ${
                                    iconClicked === index
                                        ? 'text-white bg-[#2C2C2C]'
                                        : 'text-neutral-600'
                                }`}
                                onClick={() => {
                                    tracker?.genericTrack(trackerEvent);
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
                        disabled={isLoading}
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
