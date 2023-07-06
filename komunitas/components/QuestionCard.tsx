import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Avatar from 'react-avatar';
import { AiOutlineEye, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaCircle, FaRegComment } from 'react-icons/fa';
import { useState } from 'react';
import KomunitasForm from './KomunitasForm';
import { usePostQuestionAnswerMutation } from 'komunitas/redux/api/komunitasApi';
import { toast } from 'react-toastify';
import { posthog } from 'posthog-js';

type Student = {
    id: string;
    photo_url: string;
    username: string;
};

const QuestionCard = ({
    clickable,
    id,
    slug,
    content,
    category,
    viewer_counts,
    comment_counts,
    created_at,
    student,
    isShowForm,
    setIsShowForm
}: {
    clickable: boolean;
    id?: string;
    slug?: string;
    content: string;
    category: string;
    viewer_counts: number;
    comment_counts: number;
    created_at: number;
    student: Student;
    isShowForm?: boolean;
    setIsShowForm?: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
    const [postCommunity, { isLoading }] = usePostQuestionAnswerMutation();
    const router = useRouter();

    const [formContent, setFormContent] = useState('');
    const [attachmentUrl, setAttachmentUrl] = useState<string[]>([]);
    const [attachmentName, setAttachmentName] = useState<string[]>([]);

    async function handleSubmit(): Promise<void> {
        const contentwithAttachments =
            attachmentUrl.length !== 0
                ? `${formContent}${attachmentUrl.map(
                      (value) => `\n\n[![image](${value})](${value})`
                  )}`
                : formContent;

        if (!contentwithAttachments) {
            toast.error('Jawaban tidak boleh kosong', {
                position: 'top-center',
                theme: 'colored',
                hideProgressBar: true,
                toastId: 'KATEGORI_NULL'
            });
            return;
        }

        await postCommunity({
            post_id: id,
            content: contentwithAttachments,
            category_id: category,
            attachment_urls: attachmentUrl
        });

        posthog.capture('Submit Answer on Community', {
            POST_SLUG: slug
        });

        setFormContent('');
        setAttachmentUrl([]);
        setAttachmentName([]);
    }

    return (
        <>
            <div
                className={`w-full border-[1px] border-neutral-800 rounded-xl p-[18px] md:p-5 ${
                    clickable ? 'cursor-pointer' : ''
                } ${isShowForm ? '!rounded-b-none' : ''}`}
                onClick={
                    clickable
                        ? () => {
                              posthog.capture('Visit Community Detail Page', {
                                  POST_SLUG: slug
                              });
                              router.push(`/komunitas/${slug}`);
                          }
                        : undefined
                }
                aria-hidden>
                <div className="relative flex items-center gap-3">
                    <div className="relative w-[24px] h-[24px]">
                        {student?.photo_url ? (
                            <Image
                                src={student?.photo_url}
                                alt={student?.username}
                                layout="fill"
                                className="rounded-full object-contain"
                            />
                        ) : (
                            <Avatar
                                name={student?.username}
                                size="24"
                                round
                                className="!block"
                            />
                        )}
                    </div>
                    <div className="flex flex-col md:flex-row md:gap-[6px] md:items-center">
                        <span className="inline-block font-extrabold text-xs">
                            {student?.username}
                        </span>
                        <FaCircle
                            className="hidden md:block text-neutral-600"
                            size={4}
                        />
                        <span className="inline-block font-body text-xs text-neutral-600">
                            {moment(created_at).utc().calendar()}
                        </span>
                    </div>
                </div>
                <article className="pt-[12px] pb-[18px] lg:pl-[36px]">
                    <ReactMarkdown
                        className={`text-xs font-body ${
                            clickable ? 'pointer-events-none' : ''
                        }`}
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        linkTarget={clickable ? '' : '_blank'}>
                        {content?.replaceAll('\n', '\n\n')}
                    </ReactMarkdown>
                </article>
                <div className="flex justify-between lg:pl-[36px]">
                    <div className="flex gap-6 items-center">
                        <div className="flex items-center gap-2">
                            <AiOutlineEye size={18} />
                            <span className="font-body text-xs">
                                {viewer_counts}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaRegComment className="scale-x-[-1]" size={18} />
                            <span className="font-body text-xs">
                                {comment_counts}
                            </span>
                        </div>
                    </div>
                    {!isShowForm && setIsShowForm && (
                        <button
                            className="bg-neutral-800 px-[27px] py-[7.5px] rounded-[70px] font-extrabold text-xs hover:bg-accent-purple transition-all"
                            onClick={() => {
                                posthog.capture('Click "Jawab" Button', {
                                    POST_SLUG: slug
                                });
                                setIsShowForm(true);
                            }}>
                            Jawab
                        </button>
                    )}
                </div>
            </div>
            {isShowForm && (
                <KomunitasForm
                    formContent={formContent}
                    setFormContent={setFormContent}
                    attachmentUrl={attachmentUrl}
                    setAttachmentUrl={setAttachmentUrl}
                    attachmentName={attachmentName}
                    setAttachmentName={setAttachmentName}
                    bucketKey="qna"
                    handleSubmit={handleSubmit}
                    isUsingCategories={false}
                    cancelButton={() => setIsShowForm && setIsShowForm(false)}
                    submitButtonText={
                        isLoading ? (
                            <AiOutlineLoading3Quarters className="animate-spin" />
                        ) : (
                            'Jawab'
                        )
                    }
                    className="!rounded-t-none"
                />
            )}
        </>
    );
};

export default QuestionCard;
