import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import AuthContext from 'authentication/contexts/AuthProvider';
import useAutosizeTextArea from 'komunitas/hooks/useAutosizeTextArea';
import Image from 'next/image';
import { ChangeEvent, useContext, useRef, useState } from 'react';
import Avatar from 'react-avatar';

const OPTIONS = [
    { key: '', value: 'Pilih Kategori' },
    { key: 'matematika', value: 'Matematika' },
    { key: 'fisika', value: 'Fisika' },
    { key: 'kimia', value: 'Kimia' }
];

const KomunitasForm = (): JSX.Element => {
    const { profile } = useContext(AuthContext);
    const [tulisan, setTulisan] = useState(``);
    const [category, setCategory] = useState('');

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useAutosizeTextArea(textAreaRef.current, tulisan);

    const EMBED = '\\frac{1}{2}';

    console.log(tulisan);

    function handleChange(event: ChangeEvent<HTMLTextAreaElement>): void {
        setTulisan(event.target.value);
        // setTulisan(event.target.value.replaceAll('\n', '\n\n'));
    }

    function handleSelectCategory(event: ChangeEvent<HTMLSelectElement>): void {
        setCategory(event.target.value);
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
                <div className="w-full bg-[#1D1D1D] p-[18px] md:p-5 rounded-t-[20px]">
                    <div className="flex justify-between">
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
                        <textarea
                            ref={textAreaRef}
                            className="w-full h-full font-body text-xs bg-[#1D1D1D] border-none focus:outline-none focus:ring-0 focus:appearance-none placeholder:text-neutral-600"
                            placeholder="Ketik pertanyaanmu..."
                            onChange={handleChange}
                            value={tulisan}
                        />
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

export default KomunitasForm;
