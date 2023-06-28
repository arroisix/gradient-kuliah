import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import AuthContext from 'authentication/contexts/AuthProvider';
import Image from 'next/image';
import { ChangeEvent, useContext, useState } from 'react';
import Avatar from 'react-avatar';
import useUploadFile from 'commons/hooks/useUploadFile';
import TextareaAutosize from 'react-textarea-autosize';
import { FiPaperclip } from 'react-icons/fi';
import { ImOmega } from 'react-icons/im';
import { TbSquareRoot2 } from 'react-icons/tb';
import Button from 'commons/components/elements/Button';

const OPTIONS = [
    { key: '', value: 'Pilih Kategori' },
    { key: 'matematika', value: 'Matematika' },
    { key: 'fisika', value: 'Fisika' },
    { key: 'kimia', value: 'Kimia' }
];

const KomunitasFormJadul = (): JSX.Element => {
    const { profile } = useContext(AuthContext);
    const [tulisan, setTulisan] = useState(``);
    const [category, setCategory] = useState('');
    const [attachmentUrl, setAttachmentUrl] = useState<string[]>([]);
    const [attachmentName, setAttachmentName] = useState<string[]>([]);

    const { uploadFile } = useUploadFile('qna');

    const EMBED = '\\frac{1}{2}';

    function handleChange(event: ChangeEvent<HTMLTextAreaElement>): void {
        setTulisan(event.target.value);
        // setTulisan(event.target.value.replaceAll('\n', '\n\n'));
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
            <>
                <button
                    onClick={() => {
                        if (tulisan.endsWith('\n')) {
                            setTulisan(tulisan + `$$\n${EMBED}\n$$`);
                        } else {
                            setTulisan(tulisan + ` $${EMBED}$`);
                        }
                    }}>
                    klik me
                </button>
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
                                <Avatar
                                    name={profile?.full_name}
                                    size="24"
                                    round
                                />
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
                            value={tulisan}
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
                                onClick={() =>
                                    window.open(attachmentUrl[index])
                                }
                                aria-hidden>
                                {value}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex justify-between items-center bg-[#242424] px-5 py-[10px] rounded-b-[20px]">
                    <div className="flex gap-2">
                        <div className="hidden md:block hover:bg-[#2C2C2C] px-[12px] py-[6px] rounded-[100px] cursor-pointer">
                            <TbSquareRoot2 className="text-[20px] text-neutral-600" />
                        </div>
                        <div className="hidden md:block hover:bg-[#2C2C2C] px-[12px] py-[6px] rounded-[100px] cursor-pointer">
                            <ImOmega className="text-[18px] text-neutral-600" />
                        </div>
                        <label
                            htmlFor={'inputFile'}
                            className="hover:bg-[#2C2C2C] px-[12px] py-[6px] rounded-[100px] cursor-pointer">
                            <FiPaperclip className="text-[18px] text-neutral-600" />
                        </label>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="custom"
                            className="text-neutral-600 font-extrabold text-xs px-[10px]">
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            className="font-extrabold text-xs px-[17px]">
                            Tanyakan
                        </Button>
                    </div>
                </div>
                <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}>
                    {tulisan.replaceAll('\n', '\n\n')}
                </ReactMarkdown>
            </>
        </div>
    );
};

export default KomunitasFormJadul;
