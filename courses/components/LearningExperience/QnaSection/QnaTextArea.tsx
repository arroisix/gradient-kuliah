import Button from 'commons/components/elements/Button';

import {
    ChangeEvent,
    ChangeEventHandler,
    Dispatch,
    FocusEventHandler,
    SetStateAction,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';

import { MdClose, MdInsertPhoto } from 'react-icons/md';
import { useSelector } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import { getCurrentUser } from 'authentication/redux/selectors/userSelector';
import { generateInitial } from 'commons/utils';
import useUploadFile from 'commons/hooks/useUploadFile';
import Switch from 'commons/components/elements/Form/switch';
import { TbSquareRoot2 } from 'react-icons/tb';
import { ImOmega } from 'react-icons/im';
import SymbolForm from 'komunitas/components/KomunitasForm/SymbolForm';
import MathForm from 'komunitas/components/KomunitasForm/MathForm';

const QnaTextArea = ({
    values,
    handleChange,
    handleBlur,
    setFieldValue,
    placeholder,
    avatarSize,
    disabled
}: {
    values: QnaFormInputData;
    setFieldValue: (
        field: string,
        value: any,
        shouldValidate?: boolean | undefined
    ) => void;
    placeholder: string;
    handleChange: ChangeEventHandler;
    handleBlur: FocusEventHandler;
    onCancel?: () => void;
    avatarSize?: string;
    disabled: boolean;
}): JSX.Element => {
    const user = useSelector(getCurrentUser);
    const [iconClicked, setIconClicked] = useState(-1);
    const { uploadFile } = useUploadFile('qna');
    const [isTextAreaFocus, setOnTextAreaFocus] = useState(false);
    const [attachment, setAttachment] = useState<string[]>([]);
    const [attachmentPreview, setAttachmentPreview] = useState<string[]>([]);
    const [isAnon, setIsAnon] = useState(false);
    const formRef = useRef<HTMLTextAreaElement>(null);

    const ICON: IconOption[] = useMemo(
        () => [
            {
                tag: 'button',
                icon: <TbSquareRoot2 className="text-2xl" />,
                tracker: 'Click Latex Menu',
                props: { type: 'button' }
            },
            {
                tag: 'button',
                icon: <ImOmega className="text-xl" />,
                tracker: 'Click Symbol Menu',
                props: { type: 'button' }
            },
            {
                tag: 'label',
                icon: <MdInsertPhoto className="text-2xl text-neutral-600" />,
                tracker: 'Click Attachment Menu',
                disableClick: true,
                props: { htmlFor: 'attachFile' }
            }
        ],
        []
    );

    const onInputFile = async (
        event: ChangeEvent<HTMLInputElement>
    ): Promise<void> => {
        const files: File[] = [];

        if (event.target.files) {
            for (let i = 0; i < event?.target?.files.length; ++i) {
                const file = event?.target?.files[i];

                setAttachmentPreview((prev) => [
                    ...prev,
                    URL.createObjectURL(file)
                ]);
                files.push(file);
            }
        }
        const res = await uploadFile(files);
        if (res) {
            setAttachment([...res, ...attachment]);
        }
    };

    const setFormContent: Dispatch<SetStateAction<string>> = (to) => {
        if (typeof to === 'string') setFieldValue('content', to);
        else
            setFieldValue(
                'content',
                (to as CallableFunction)?.(values.content)
            );
    };

    useEffect(() => {
        if (attachment.length > 0) {
            setFieldValue('attachment', JSON.stringify(attachment));
        }
    }, [attachment]);

    useEffect(() => {
        setFieldValue('is_anonymous', isAnon);
    }, [isAnon]);

    const onFocus = (): void => {
        setOnTextAreaFocus(true);
    };

    const onUnFocus = (): void => {
        setOnTextAreaFocus(false);
    };

    const removeAttachment = (index: number): void => {
        URL.revokeObjectURL(attachmentPreview[index]);
        setAttachmentPreview((current) => [
            ...current.slice(0, index),
            ...current.slice(index + 1)
        ]);
        setAttachment((current) => [
            ...current.slice(0, index),
            ...current.slice(index + 1)
        ]);
    };

    const resetFormState = (): void => {
        setAttachmentPreview([]);
        setAttachment([]);
        setIsAnon(false);
    };

    return (
        <>
            <div
                className={`${
                    avatarSize ?? 'h-[60px] w-[60px]'
                } self-center sm:self-auto bg-neutral-800 rounded-full overflow-hidden flex justify-center items-center`}>
                <span className="font-bold md:text-xl">
                    {generateInitial(user.full_name)}
                </span>
            </div>
            <div
                className="flex flex-col w-full gap-2"
                onMouseDown={onFocus}
                onFocusCapture={onFocus}
                onBlurCapture={onUnFocus}
                tabIndex={0}
                role="textbox">
                <TextareaAutosize
                    ref={formRef}
                    value={values.content}
                    name="content"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={onFocus}
                    onMouseDown={onFocus}
                    onMouseEnter={onFocus}
                    onFocusCapture={onFocus}
                    onBlurCapture={onUnFocus}
                    placeholder={placeholder}
                    className="w-full transition-all bg-transparent border-transparent resize-none focus:border-transparent focus:ring-0 focus:ring-transparent"
                />
                {attachmentPreview.length > 0 && (
                    <div className="py-2 overflow-x-auto w-full max-w-[70vw] lg:max-w-[50vw]">
                        <div className="flex w-screen gap-2">
                            {attachmentPreview.map((url: string, index) => (
                                <div
                                    className="relative flex items-center w-32 h-32 rounded bg-neutral-800"
                                    key={url}>
                                    <img
                                        src={url}
                                        alt={url}
                                        height={128}
                                        width={128}
                                        className="object-contain"
                                    />
                                    <MdClose
                                        className="absolute cursor-pointer z-5 right-1 top-1"
                                        onClick={() => removeAttachment(index)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div
                    className={`h-[1px] ${
                        isTextAreaFocus ? 'bg-white' : 'bg-neutral-600'
                    } w-full`}
                />
                <div className="flex flex-wrap items-center w-full gap-1 sm:flex-nowrap">
                    {ICON.filter((opt) => !opt.disabled).map(
                        ({ tag: Tag, icon, props = {} }, index) => (
                            <Tag
                                key={index}
                                className={`block hover:bg-[#2C2C2C] px-[12px] py-[6px] rounded-[100px] cursor-pointer ${
                                    iconClicked === index
                                        ? 'text-white bg-[#2C2C2C]'
                                        : 'text-neutral-600'
                                }`}
                                onClick={() =>
                                    setIconClicked((prev) =>
                                        prev === index ? -1 : index
                                    )
                                }
                                {...props}>
                                {icon}
                            </Tag>
                        )
                    )}
                    <div className="flex flex-1 gap-2">
                        <Switch
                            checked={isAnon}
                            setChecked={() => setIsAnon(!isAnon)}
                        />
                        <span
                            className={`transition-all ${
                                isAnon ? 'text-white' : 'text-neutral-600'
                            }`}>
                            Anonim
                        </span>
                    </div>
                    <input
                        type="file"
                        id="attachFile"
                        hidden
                        multiple
                        accept={'image/png,image/gif,image/jpeg,image/jpg'}
                        onChange={onInputFile}
                    />
                    <Button
                        onClick={resetFormState}
                        disabled={disabled}
                        variant="primary"
                        size="extraSmall"
                        type="submit"
                        className="w-full sm:w-auto">
                        Kirim
                    </Button>
                </div>
                {(iconClicked === 0 || iconClicked === 1) && (
                    <div className="p-4 bg-neutral-900 rounded-box md:p-6">
                        {iconClicked === 0 ? (
                            <MathForm />
                        ) : (
                            <SymbolForm
                                onClickSymbol={(value) =>
                                    setFormContent((content) => content + value)
                                }
                            />
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default QnaTextArea;
