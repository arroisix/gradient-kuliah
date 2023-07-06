import AuthContext from 'authentication/contexts/AuthProvider';
import Image from 'next/image';
import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useContext,
    useRef
} from 'react';
import Avatar from 'react-avatar';
import useUploadFile from 'commons/hooks/useUploadFile';
import TextareaAutosize from 'react-textarea-autosize';
import AdvanceForm from './AdvanceForm';
import { IoMdClose } from 'react-icons/io';

const KomunitasForm = ({
    formContent,
    setFormContent,
    category,
    setCategory,
    attachmentUrl,
    setAttachmentUrl,
    attachmentName,
    setAttachmentName,
    bucketKey,
    handleSubmit,
    cancelButton,
    isUsingCategories,
    subjectCategories,
    submitButtonText,
    className
}: {
    formContent: string;
    setFormContent: Dispatch<SetStateAction<string>>;
    category?: string;
    setCategory?: Dispatch<SetStateAction<string>>;
    attachmentUrl: string[];
    setAttachmentUrl: Dispatch<SetStateAction<string[]>>;
    attachmentName: string[];
    setAttachmentName: Dispatch<SetStateAction<string[]>>;
    bucketKey?: string;
    handleSubmit: () => Promise<void>;
    cancelButton?: () => void;
    isUsingCategories: boolean;
    subjectCategories?: [{ id: string; name: string }];
    submitButtonText: JSX.Element | string;
    className?: string;
}): JSX.Element => {
    const { profile } = useContext(AuthContext);

    const formRef = useRef<HTMLTextAreaElement>(null);

    const { uploadFile } = useUploadFile(bucketKey);

    function handleChange(event: ChangeEvent<HTMLTextAreaElement>): void {
        setFormContent(event.target.value);
    }

    function handleSelectCategory(event: ChangeEvent<HTMLSelectElement>): void {
        if (setCategory) {
            setCategory(event.target.value);
        }
    }

    async function handleInputFile(
        event: ChangeEvent<HTMLInputElement>
    ): Promise<void> {
        const files: File[] = [];

        if (event.target.files) {
            for (let i = 0; i < event?.target?.files.length; ++i) {
                const file = event?.target?.files[i];

                files.push(file);
                setAttachmentName([file.name, ...attachmentName]);
            }
        }
        const res = await uploadFile(files);
        if (res) {
            setAttachmentUrl([...res, ...attachmentUrl]);
        }
    }

    return (
        <div>
            <input
                type="file"
                id={'inputFile'}
                hidden
                multiple
                accept={'image/png,image/gif,image/jpeg,image/jpg'}
                onChange={handleInputFile}
            />
            <div
                className={`w-full bg-[#1D1D1D] p-[18px] md:p-5 rounded-t-[20px] ${className}`}>
                <div className="flex flex-wrap justify-between gap-2">
                    <div className="flex items-center gap-3">
                        {!!profile?.photo_profile ? (
                            <div className="w-[24px] h-[24px] relative">
                                <Image
                                    src={profile.photo_profile}
                                    layout="fill"
                                    className="rounded-full"
                                />
                            </div>
                        ) : (
                            <Avatar name={profile?.full_name} size="24" round />
                        )}
                        <span className="font-bold text-xs">
                            {profile?.username}
                        </span>
                    </div>
                    {isUsingCategories && (
                        <select
                            className={`pl-[18px] pr-[50px] border-none bg-[#2C2C2C] rounded-[70px] text-xs font-bold cursor-pointer focus:outline-none focus:ring-0 focus:appearance-none ${
                                category === '' ? 'text-neutral-600' : ''
                            }`}
                            onChange={handleSelectCategory}
                            name={'name'}>
                            <option
                                className="pt-4 text-neutral-600"
                                key=""
                                value=""
                                label="Pilih Kategori">
                                Pilih Kategori
                            </option>
                            {subjectCategories?.map((option) => (
                                <option
                                    className="pt-4 text-white"
                                    key={option.id}
                                    value={option.id}
                                    label={option.name}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                <div className="w-full h-full md:pl-[24px]">
                    <TextareaAutosize
                        ref={formRef}
                        value={formContent}
                        name="form"
                        onChange={handleChange}
                        placeholder="Ketik pertanyaanmu..."
                        className="w-full h-full font-body text-xs bg-[#1D1D1D] border-none focus:outline-none focus:ring-0 focus:appearance-none placeholder:text-neutral-600"
                    />
                </div>
                <div className="flex gap-3 flex-wrap">
                    {attachmentName.map((value, index) => (
                        <div
                            key={index}
                            className="relative px-[10px] py-[6px] text-[10px] font-body bg-[#272727] rounded-[4px]">
                            <span
                                className="inline-block"
                                onClick={() =>
                                    window.open(attachmentUrl[index])
                                }
                                aria-hidden>
                                {value}
                            </span>
                            <div
                                className="absolute top-[-5px] right-[-5px] w-[15px] h-[15px] bg-[#373737] rounded-full flex justify-center items-center cursor-pointer"
                                onClick={() => {
                                    setAttachmentName((prev) =>
                                        prev.filter((item, id) => id !== index)
                                    );
                                    setAttachmentUrl((prev) =>
                                        prev.filter((item, id) => id !== index)
                                    );
                                }}
                                aria-hidden>
                                <IoMdClose className="text-neutral-400" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <AdvanceForm
                setFormContent={setFormContent}
                formRef={formRef}
                handleSubmit={handleSubmit}
                cancelButton={cancelButton}
                submitButtonText={submitButtonText}
            />
        </div>
    );
};

export default KomunitasForm;
