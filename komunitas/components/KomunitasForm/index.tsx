import AuthContext from 'authentication/contexts/AuthProvider';
import Image from 'next/image';
import { ChangeEvent, useContext, useRef, useState } from 'react';
import Avatar from 'react-avatar';
import TextareaAutosize from 'react-textarea-autosize';
import AdvanceForm from './AdvanceForm';
import AttachmentForm from './AttachmentForm';

const KomunitasForm = ({
    bucketKey,
    onSubmit,
    cancelButton,
    isUsingCategories,
    subjectCategories,
    submitButtonText,
    className,
    context
}: {
    bucketKey?: string;
    onSubmit: (
        formContent: string,
        category: string,
        attachmentUrl: string[],
        attachmentName: string[]
    ) => Promise<void>;
    cancelButton?: () => void;
    isUsingCategories: boolean;
    subjectCategories?: [{ id: string; name: string }];
    submitButtonText: JSX.Element | string;
    className?: string;
    context: 'q' | 'a';
}): JSX.Element => {
    const [formContent, setFormContent] = useState('');
    const [category, setCategory] = useState('');
    const [attachmentUrl, setAttachmentUrl] = useState<string[]>([]);
    const [attachmentName, setAttachmentName] = useState<string[]>([]);

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

    const textInputPlaceholder =
        context === 'q' ? 'Ketik pertanyaanmu...' : 'Ketik jawabanmu...';

    async function handleSubmit(): Promise<void> {
        try {
            await onSubmit(
                formContent,
                category,
                attachmentUrl,
                attachmentName
            );
            setFormContent('');
            setCategory('');
            setAttachmentUrl([]);
            setAttachmentName([]);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div>
            <div
                className={`w-full bg-[#1D1D1D] p-[18px] md:p-5 rounded-t-[20px] ${className}`}>
                <div className="flex flex-wrap justify-between gap-2">
                    <div className="flex items-center gap-3">
                        {profile?.photo_profile &&
                        profile.photo_profile.length > 0 ? (
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
                        placeholder={textInputPlaceholder}
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
                context={context}
            />
        </div>
    );
};

export default KomunitasForm;
