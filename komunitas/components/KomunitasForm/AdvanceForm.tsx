import Button from 'commons/components/elements/Button';
import { useMemo, useState } from 'react';
import { ImOmega } from 'react-icons/im';
import { TbSquareRoot2 } from 'react-icons/tb';
import MathForm from './MathForm';
import SymbolForm from './SymbolForm';
import { FiPaperclip } from 'react-icons/fi';
import { useTracker } from 'tracker/tracker';
import { useCurrentEditor } from '@tiptap/react';
import { useAuth } from 'authentication/contexts/AuthProvider';

type IconOption = {
    tag: keyof JSX.IntrinsicElements;
    icon: JSX.Element;
    tracker: string;
    disableClick?: boolean;
    disabled?: boolean;
    props?: Record<string, any>;
};

type AdvanceFormProps = {
    handleSubmit: () => Promise<void>;
    cancelButton?: () => void;
    submitButtonText: JSX.Element | string;
    isLoading?: boolean;
    context: 'q' | 'a';
};

const AdvanceForm = ({
    handleSubmit,
    cancelButton,
    submitButtonText,
    isLoading,
    context
}: AdvanceFormProps): JSX.Element => {
    const { profile } = useAuth();

    const ICON: IconOption[] = useMemo(
        () => [
            {
                tag: 'div',
                icon: <TbSquareRoot2 className="text-[20px]" />,
                tracker: 'Click Latex Menu'
            },
            {
                tag: 'div',
                icon: <ImOmega className="text-[16px]" />,
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

    const { editor } = useCurrentEditor();
    const handleAddSymbol = (symbol: string) => {
        editor?.commands.insertContent(symbol);
    };

    const [iconClicked, setIconClicked] = useState(-1);
    const tracker = useTracker();

    return (
        <div className="bg-[#242424] p-3 rounded-b-[20px]">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-[2px]">
                    {ICON.filter((opt) => {
                        if (
                            profile?.email !== 'business@gradient.academy' &&
                            profile?.email !== 'angga@gradient.academy'
                        ) {
                            return !opt.disabled;
                        }
                        return true;
                    }).map(
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
                                className={`h-[30px] hover:bg-[#2C2C2C] px-[12px] py-[6px] rounded-[100px] cursor-pointer flex items-center ${
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
                            className="text-neutral-600 font-extrabold text-xs !py-2 !px-4 !font-sans"
                            onClick={cancelButton}>
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            className="font-extrabold text-xs !py-2 !px-4 !font-sans"
                            onClick={handleSubmit}>
                            {submitButtonText}
                        </Button>
                    </div>
                )}
            </div>
            {iconClicked === 0 && <MathForm />}
            {iconClicked === 1 && (
                <SymbolForm onClickSymbol={handleAddSymbol} />
            )}
            {iconClicked !== -1 && (
                <div className="flex gap-2 justify-end pb-[10px]">
                    <Button
                        variant="custom"
                        className="text-neutral-600 font-extrabold text-xs !py-2 !px-4 !font-sans"
                        onClick={cancelButton}>
                        Batal
                    </Button>
                    <Button
                        variant="primary"
                        disabled={isLoading}
                        className="font-extrabold text-xs !py-2 !px-4 !font-sans"
                        onClick={handleSubmit}>
                        {submitButtonText}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AdvanceForm;
