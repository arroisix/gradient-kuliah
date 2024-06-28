import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import Image from 'next/image';
import { useContext, useState } from 'react';
import Avatar from 'react-avatar';
import { BsHexagonFill, BsCheck } from 'react-icons/bs';
import { FaCircle, FaRegComment } from 'react-icons/fa';
import ReplyComment from './ReplyComment';
import KomunitasInput from './KomunitasInput';
import moment from 'moment';
import {
    useGetCommunityPostCommentDetailQuery,
    usePostQuestionAnswerMutation
} from 'komunitas/redux/api/komunitasApi';
import AuthContext from 'authentication/contexts/AuthProvider';
import Skeleton from 'commons/components/elements/Skeleton';
import { useTracker } from 'tracker/tracker';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { IoMdSend } from 'react-icons/io';

type Student = {
    id: string;
    photo_url: string;
    username: string;
    is_expert: boolean;
};

const AnswerCard = ({
    isExpert,
    id,
    content,
    comment_counts,
    created_at,
    student,
    category,
    questionId
}: {
    isExpert: boolean;
    id: string;
    content: string;
    comment_counts: number;
    created_at: number;
    student: Student;
    category: string;
    questionId: string;
}): JSX.Element => {
    const [comment, setComment] = useState('');
    const [showComment, setShowComment] = useState(true);
    const [authorImageError, setAuthorImageError] = useState(false);
    const [myImageError, setMyImageError] = useState(false);

    const { checkCustomBreakpoints } = useWindowBreakpoints();
    const { profile } = useContext(AuthContext);

    const [postComment] = usePostQuestionAnswerMutation();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data: replies, isLoading } = useGetCommunityPostCommentDetailQuery({
        post_id: id,
        isAuthenticated: isAuthenticated
    });

    function handleChangeComment(
        event: React.ChangeEvent<HTMLInputElement>
    ): void {
        setComment(event.target.value);
    }

    const tracker = useTracker();
    async function handleSubmitComment(): Promise<void> {
        await postComment({
            post_id: id,
            content: comment,
            category_id: category,
            attachment_urls: []
        });

        tracker?.genericTrack('Submit Answer Comment on Community', {
            'Post ID': questionId,
            'Answer ID': id
        });

        setComment('');
        setShowComment(true);
    }

    return (
        <div
            id={id}
            className={`flex flex-col gap-3 w-full border-[1px] rounded-xl p-[18px] md:p-5 ${
                isExpert
                    ? 'border-[#00880080] bg-[#0088001A]'
                    : 'border-neutral-800'
            }`}>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="relative w-[24px] h-[24px]">
                        {student?.photo_url != null &&
                        student.photo_url.length > 0 &&
                        !authorImageError ? (
                            <Image
                                src={student.photo_url}
                                alt={student.username}
                                layout="fill"
                                className="object-contain rounded-full"
                                onError={() => setAuthorImageError(true)}
                            />
                        ) : (
                            <Avatar name={student?.username} size="24" round />
                        )}
                    </div>
                    <div className="flex flex-col md:flex-row md:gap-[6px] md:items-center">
                        <span className="inline-block text-xs font-extrabold">
                            {student?.username}
                        </span>
                        <FaCircle
                            className="hidden md:block text-neutral-600"
                            size={4}
                        />
                        <span className="inline-block text-xs font-body text-neutral-600">
                            {moment(created_at).utc().calendar()}
                        </span>
                    </div>
                </div>
                {isExpert && (
                    <div className="flex items-center gap-[6px] px-[10px] py-[3.5px] rounded-[70px] bg-[#008800]">
                        <div className="relative w-[14px] h-[14px]">
                            <BsHexagonFill className="text-white" size={14} />
                            <BsCheck
                                className="absolute top-0 left-0 text-[#008800]"
                                size={14}
                            />
                        </div>
                        <span className="font-bold text-[10px] text-center">
                            {!checkCustomBreakpoints(375) && 'Jawaban'}{' '}
                            Terverifikasi
                        </span>
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-[18px] lg:pl-[36px]">
                <article>
                    <ReactMarkdown
                        className="overflow-auto markdown-body-xs markdown-overflow-break-word markdown-blue-link font-body markdown-img-max-height"
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex]}
                        linkTarget={'_blank'}>
                        {content?.replaceAll('\n', '\n\n')}
                    </ReactMarkdown>
                </article>
                <div
                    className="flex items-center gap-2 cursor-pointer w-fit"
                    onClick={() => setShowComment((prev) => !prev)}
                    aria-hidden>
                    <FaRegComment className="scale-x-[-1]" size={18} />
                    <span className="text-xs font-body">{comment_counts}</span>
                </div>
            </div>
            <div className="flex flex-col gap-6 border-t-[1px] border-[#272727] pt-[18px]">
                <div className="flex items-center gap-3">
                    <div className="relative w-[24px] h-[24px]">
                        {profile?.photo_profile != null &&
                        profile?.photo_profile.length > 0 &&
                        !myImageError ? (
                            <Image
                                src={profile.photo_profile}
                                alt={profile.username}
                                layout="fill"
                                className="object-contain rounded-full"
                                onError={() => setMyImageError(true)}
                            />
                        ) : (
                            <Avatar
                                name={profile?.username}
                                size="24"
                                round
                                className="!block"
                            />
                        )}
                    </div>
                    <KomunitasInput
                        type="text"
                        name="comment"
                        value={comment}
                        onChange={handleChangeComment}
                        placeholder="Tambahkan komentar"
                        isSubmitOnEnter={false}
                        handleSubmit={handleSubmitComment}
                    />
                    <button
                        type="submit"
                        onClick={handleSubmitComment}
                        className="self-end btn btn-circle btn-primary btn-sm">
                        <IoMdSend />
                    </button>
                </div>
                {showComment && comment_counts !== 0 && (
                    <div className="flex flex-col gap-[18px]">
                        {isLoading && <Skeleton className="h-[16px] !m-0" />}
                        {replies?.comments?.map(({ id, content, student }) => (
                            <ReplyComment
                                key={id}
                                content={content}
                                student={student}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnswerCard;
