import Button from 'commons/components/elements/Button';

import {
    ChangeEvent,
    ChangeEventHandler,
    FocusEventHandler,
    useEffect,
    useState
} from 'react';

import { MdClose, MdInsertPhoto } from 'react-icons/md';
import { useSelector } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import { getCurrentUser } from 'authentication/redux/selectors/userSelector';
import { generateInitial, makeid } from 'commons/utils';
import useUploadFile from 'commons/hooks/useUploadFile';
import Switch from 'commons/components/elements/Form/switch';

interface QnaFormInputData {
    content: string;
    attachment?: string;
}

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
    const { uploadFile } = useUploadFile('qna');
    const [isTextAreaFocus, setOnTextAreaFocus] = useState(false);
    const [attachment, setAttachment] = useState<string[]>([]);
    const [attachmentPreview, setAttachmentPreview] = useState<string[]>([]);
    const [isAnon, setIsAnon] = useState(false);
    const formId = makeid(10);

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
            <div>
                <div
                    className={`${
                        avatarSize ?? 'h-[60px] w-[60px]'
                    } bg-neutral-800 rounded-full overflow-hidden flex justify-center items-center`}>
                    <span className="font-bold md:text-xl">
                        {generateInitial(user.full_name)}
                    </span>
                </div>
            </div>
            <div
                className="flex flex-col w-full gap-2"
                onMouseDown={onFocus}
                onFocusCapture={onFocus}
                onBlurCapture={onUnFocus}
                tabIndex={0}
                role="textbox">
                <TextareaAutosize
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
                    className="bg-transparent transition-all resize-none w-full border-transparent focus:border-transparent focus:ring-0 focus:ring-transparent"
                />
                {attachmentPreview.length > 0 && (
                    <div className="py-2 overflow-x-auto w-full max-w-[70vw] lg:max-w-[50vw]">
                        <div className="flex gap-2 w-screen">
                            {attachmentPreview.map((url: string, index) => (
                                <div
                                    className="rounded bg-neutral-800 h-32 w-32 relative flex items-center"
                                    key={url}>
                                    <img
                                        src={url}
                                        alt={url}
                                        height={128}
                                        width={128}
                                        className="object-contain"
                                    />
                                    <MdClose
                                        className="z-5 absolute right-1 top-1 cursor-pointer"
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
                <div className="flex justify-between items-center w-full">
                    <div className="flex gap-2">
                        <input
                            type="file"
                            id={formId}
                            hidden
                            multiple
                            accept={'image/png,image/gif,image/jpeg,image/jpg'}
                            onChange={onInputFile}
                        />
                        <label htmlFor={formId}>
                            <MdInsertPhoto className="text-2xl text-neutral-400 cursor-pointer hover:text-white" />
                        </label>
                        <div className="flex gap-2">
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
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={resetFormState}
                            disabled={disabled}
                            variant="primary"
                            size="extraSmall"
                            type="submit">
                            Kirim
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QnaTextArea;
