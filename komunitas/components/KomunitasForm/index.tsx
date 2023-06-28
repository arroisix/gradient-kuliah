import AuthContext from 'authentication/contexts/AuthProvider';
import Image from 'next/image';
import { ChangeEvent, useContext, useState } from 'react';
import Avatar from 'react-avatar';
import useUploadFile from 'commons/hooks/useUploadFile';
import TextareaAutosize from 'react-textarea-autosize';
import AdvanceForm from './AdvanceForm';

const OPTIONS = [
    { key: '', value: 'Pilih Kategori' },
    { key: 'matematika', value: 'Matematika' },
    { key: 'fisika', value: 'Fisika' },
    { key: 'kimia', value: 'Kimia' }
];

const KomunitasForm = (): JSX.Element => {
    const { profile } = useContext(AuthContext);
    const [formContent, setFormContent] = useState(``);
    const [category, setCategory] = useState('');
    const [attachmentUrl, setAttachmentUrl] = useState<string[]>([]);
    const [attachmentName, setAttachmentName] = useState<string[]>([]);

    const { uploadFile } = useUploadFile('qna');

    function handleChange(event: ChangeEvent<HTMLTextAreaElement>): void {
        setFormContent(event.target.value);
    }

    function handleSelectCategory(event: ChangeEvent<HTMLSelectElement>): void {
        setCategory(event.target.value);
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
            <div className="w-full bg-[#1D1D1D] p-[18px] md:p-5 rounded-t-[20px]">
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
                    <select
                        className={`pl-[18px] pr-[50px] border-none bg-[#2C2C2C] rounded-[70px] text-xs font-bold cursor-pointer focus:outline-none focus:ring-0 focus:appearance-none ${
                            category === '' ? 'text-neutral-600' : ''
                        }`}
                        onChange={handleSelectCategory}
                        name={'name'}>
                        {OPTIONS.map((o) => (
                            <option
                                className={`pt-4 ${
                                    o.key === ''
                                        ? 'text-neutral-600'
                                        : 'text-white'
                                }`}
                                key={o.key}
                                value={o.key}
                                label={o.value}>
                                {o.value}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-full h-full md:pl-[24px]">
                    <TextareaAutosize
                        value={formContent}
                        name="form"
                        onChange={handleChange}
                        placeholder="Ketik pertanyaanmu..."
                        className="w-full h-full font-body text-xs bg-[#1D1D1D] border-none focus:outline-none focus:ring-0 focus:appearance-none placeholder:text-neutral-600"
                    />
                </div>
                <div className="flex gap-3 flex-wrap">
                    {attachmentName.map((value, index) => (
                        <span
                            key={index}
                            className="inline-block px-[10px] py-[6px] text-[10px] font-body bg-[#272727] rounded-[4px]"
                            onClick={() => window.open(attachmentUrl[index])}
                            aria-hidden>
                            {value}
                        </span>
                    ))}
                </div>
            </div>
            <AdvanceForm setFormContent={setFormContent} />
        </div>
    );
};

export default KomunitasForm;
