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
import TextareaAutosize from 'react-textarea-autosize';
import AdvanceForm from './AdvanceForm';
import AttachmentForm from './AttachmentForm';

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

    function handleChange(event: ChangeEvent<HTMLTextAreaElement>): void {
        setFormContent(event.target.value);
    }

    function handleSelectCategory(event: ChangeEvent<HTMLSelectElement>): void {
        if (setCategory) {
            setCategory(event.target.value);
        }
    }
    return (
        <div>
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
                <AttachmentForm
                    attachmentName={attachmentName}
                    attachmentUrl={attachmentUrl}
                    setAttachmentName={setAttachmentName}
                    setAttachmentUrl={setAttachmentUrl}
                    bucketKey={bucketKey}
                />
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
