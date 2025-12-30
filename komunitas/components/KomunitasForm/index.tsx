import AuthContext from 'authentication/contexts/AuthProvider';
import Image from 'next/image';
import { ChangeEvent, useContext, useMemo, useState } from 'react';
import Avatar from 'react-avatar';
import AdvanceForm from './AdvanceForm';
import AttachmentForm from './AttachmentForm';
import clsx from 'clsx';

import '@benrbray/prosemirror-math/style/math.css';
import 'prosemirror-view/style/prosemirror.css';
import Star from 'commons/components/elements/Icons/Star';

import {
    EditorContent,
    EditorContext,
    useEditor,
    EditorConsumer
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { MathDisplay, MathInline } from 'komunitas/mathPlugin';
import { Markdown } from 'tiptap-markdown';
import { toast } from 'react-toastify';

type KomunitasFormProps = {
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
    isLoading?: boolean;
    className?: string;
    context: 'q' | 'a';
};

const KomunitasForm = ({
    bucketKey,
    cancelButton,
    isUsingCategories,
    subjectCategories,
    submitButtonText,
    className,
    isLoading,
    context
}: KomunitasFormProps): JSX.Element | null => {
    const [category, setCategory] = useState('');
    const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);
    const [attachmentNames, setAttachmentNames] = useState<string[]>([]);

    const { profile } = useContext(AuthContext);

    function handleSelectCategory(event: ChangeEvent<HTMLSelectElement>): void {
        if (setCategory) {
            setCategory(event.target.value);
        }
    }

    const textInputPlaceholder =
        context === 'q' ? 'Ketik pertanyaanmu...' : 'Ketik jawabanmu...';

    const tiptapPlaceholderPlugin = useMemo(
        () => Placeholder.configure({ placeholder: textInputPlaceholder }),
        [textInputPlaceholder]
    );

    const editor = useEditor({
        extensions: [
            StarterKit,
            Markdown,
            tiptapPlaceholderPlugin,

            MathDisplay,
            MathInline
        ]
    });

    async function handleSubmit(): Promise<void> {
        try {
            toast.info(
                'Fitur Diskusi sudah tidak tersedia untuk saat ini, silahkan beralih menggunakan fitur Copilot AI ya!'
            );
        } catch (e) {
            console.error(e);
        }
    }

    if (!editor) {
        return null;
    }

    return (
        <div>
            <EditorContext.Provider value={{ editor }}>
                <div
                    className={clsx(
                        'w-full bg-[#1D1D1D] p-4 md:p-5 rounded-t-[20px]',
                        className
                    )}>
                    <div className="flex flex-wrap justify-between gap-2 mb-5">
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
                                <Avatar
                                    name={profile?.username}
                                    size="24"
                                    round
                                />
                            )}
                            <span className="text-xs font-bold">
                                {profile?.username}
                            </span>
                        </div>
                        {isUsingCategories && (
                            <select
                                className={clsx(
                                    'pl-[18px] pr-[50px] border-none bg-[#20222E] rounded-[70px] text-xs font-bold cursor-pointer focus:outline-none focus:ring-0 focus:appearance-none',
                                    category === '' && 'text-neutral-600'
                                )}
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
                    <div className="flex flex-col w-full h-full gap-5">
                        <EditorConsumer>
                            {({ editor: currentEditor }) => (
                                <EditorContent
                                    editor={currentEditor}
                                    className="md:pl-9 max-h-60 overflow-auto komunitas-editor"
                                />
                            )}
                        </EditorConsumer>

                        <AttachmentForm
                            attachmentNames={attachmentNames}
                            attachmentUrl={attachmentUrls}
                            setAttachmentNames={setAttachmentNames}
                            setAttachmentUrl={setAttachmentUrls}
                            bucketKey={bucketKey}
                        />
                        {!editor?.state.doc.textContent && (
                            <section className="flex rounded-[4px] items-center py-2 px-3 gap-2 border-solid border-[#5F2BCE] border-[1px] bg-[rgba(95,43,206,0.20)] max-w-max">
                                <Star className="shrink-0" />
                                <p className="text-xs">
                                    Tolong ketik agar bisa dicari temanmu!
                                    Gambar aja gak akan dijawab
                                </p>
                            </section>
                        )}
                    </div>
                </div>

                <AdvanceForm
                    handleSubmit={handleSubmit}
                    cancelButton={cancelButton}
                    submitButtonText={submitButtonText}
                    isLoading={isLoading}
                    context={context}
                />
            </EditorContext.Provider>
        </div>
    );
};

export default KomunitasForm;
