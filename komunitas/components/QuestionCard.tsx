import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import moment from 'moment';
import Image from 'next/image';
import Avatar from 'react-avatar';
import { AiOutlineEye, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaCircle, FaRegComment } from 'react-icons/fa';
import { useState } from 'react';
import KomunitasForm from './KomunitasForm';
import { usePostQuestionAnswerMutation } from 'komunitas/redux/api/komunitasApi';
import { toast } from 'react-toastify';
import { useTracker } from 'tracker/tracker';
import Link from 'next/link';
import { cn } from 'commons/utils';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';

type Student = {
    id: string;
    photo_url: string;
    username: string;
};

const Wrapper = ({
    children,
    clickable,
    slug
}: React.PropsWithChildren<{
    clickable: boolean;
    slug?: string;
}>): JSX.Element =>
    clickable ? (
        <Link href={`/komunitas/${slug}`} className="w-full">
            {children}
        </Link>
    ) : (
        <>{children}</>
    );

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
    const tracker = useTracker();

    const [imageError, setImageError] = useState(false);
    const isAuthenticated = useSelector(getIsAuthenticated);

    async function handleSubmit(
        formContent: string,
        _category: string,
        attachmentUrl: string[]
    ): Promise<void> {
        if (isLoading) return;
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
            throw new Error('KATEGORI_NULL');
        }

        await postCommunity({
            post_id: id,
            content: contentwithAttachments,
            category_id: category,
            attachment_urls: attachmentUrl
        });

        tracker?.genericTrack('Submit Answer on Community', {
            'Post Slug': slug
        });

        setIsShowForm?.(false);
    }

    return (
        <Wrapper clickable={clickable} slug={slug}>
            <div
                className={cn(
                    'border border-neutral-800 rounded-xl p-4 md:p-5 flex flex-col',
                    isShowForm && '!rounded-b-none'
                )}>
                <div className="flex items-center gap-3">
                    {student?.photo_url &&
                    student.photo_url.length > 0 &&
                    !imageError ? (
                        <Image
                            src={student?.photo_url}
                            alt={student?.username}
                            width={24}
                            height={24}
                            className="object-contain rounded-full"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <Avatar
                            name={student?.username}
                            size="24"
                            round
                            className="!block"
                        />
                    )}
                    <div className="flex flex-col md:flex-row md:gap-2 md:items-center">
                        <p className="text-xs font-extrabold">
                            {student?.username}
                        </p>
                        <FaCircle
                            className="hidden md:block text-neutral-600"
                            size={4}
                        />
                        <p className="text-xs font-body text-neutral-600">
                            {moment(created_at).utc().calendar()}
                        </p>
                    </div>
                </div>
                <article className="pt-3 pb-5 lg:pl-8">
                    <ReactMarkdown
                        className={`markdown-body-xs markdown-overflow-break-word markdown-blue-link font-body markdown-img-max-height markdown-body math-display-overflow`}
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex]}
                        linkTarget={clickable ? '' : '_blank'}>
                        {content}
                    </ReactMarkdown>
                </article>
                <div className="flex justify-between lg:pl-8">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <AiOutlineEye size={18} />
                            <span className="text-xs font-body">
                                {viewer_counts}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaRegComment className="scale-x-[-1]" size={18} />
                            <span className="text-xs font-body">
                                {comment_counts}
                            </span>
                        </div>
                    </div>
                    {!isShowForm && setIsShowForm && isAuthenticated && (
                        <button
                            className="bg-neutral-800 px-[27px] py-[7.5px] rounded-[70px] font-extrabold text-xs hover:bg-accent-purple transition-all"
                            onClick={() => {
                                tracker?.genericTrack('Click "Jawab" Button', {
                                    'Post Slug': slug
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
                    bucketKey="qna"
                    onSubmit={handleSubmit}
                    isUsingCategories={false}
                    cancelButton={() => setIsShowForm && setIsShowForm(false)}
                    isLoading={isLoading}
                    submitButtonText={
                        isLoading ? (
                            <AiOutlineLoading3Quarters className="animate-spin" />
                        ) : (
                            'Jawab'
                        )
                    }
                    className="!rounded-t-none"
                    context="a"
                />
            )}
        </Wrapper>
    );
};

export default QuestionCard;
