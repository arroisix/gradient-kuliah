import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import Image from 'next/image';
import { useState } from 'react';
import Avatar from 'react-avatar';
import { BsHexagonFill, BsCheck } from 'react-icons/bs';
import { FaCircle, FaRegComment } from 'react-icons/fa';
import ReplyComment from './ReplyComment';
import KomunitasInput from './KomunitasInput';
import moment from 'moment';

const DUMMY_COMMENT = {
    comments: [
        {
            id: '45',
            content: 'baik bangs',
            comment_counts: 8,
            created_at: 1687229985,
            user: {
                id: '5',
                photo_url: '',
                username: 'kamil.irfan',
                is_expert: true
            }
        },
        {
            id: '43',
            content: 'Sehat serta mulia gan',
            comment_counts: 8,
            created_at: 187229985,
            user: {
                id: '5',
                photo_url: '',
                username: 'bang.mil',
                is_expert: false
            }
        }
    ],
    total_items: 10,
    current_page: 10,
    items_per_page: 10
};

type User = {
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
    user
}: {
    isExpert: boolean;
    id: string;
    content: string;
    comment_counts: number;
    created_at: number;
    user: User;
}): JSX.Element => {
    const [comment, setComment] = useState('');
    const [showComment, setShowComment] = useState(false);

    const { checkCustomBreakpoints } = useWindowBreakpoints();

    function handleChangeComment(
        event: React.ChangeEvent<HTMLInputElement>
    ): void {
        console.log(id); // prevent error
        setComment(event.target.value);
    }

    return (
        <div
            className={`flex flex-col gap-3 w-full border-[1px] rounded-xl p-[18px] md:p-5 ${
                isExpert
                    ? 'border-[#00880080] bg-[#0088001A]'
                    : 'border-neutral-800'
            }`}>
            <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="relative w-[24px] h-[24px]">
                        {user?.photo_url ? (
                            <Image
                                src={user?.photo_url}
                                alt={user?.username}
                                layout="fill"
                                className="rounded-full object-contain"
                            />
                        ) : (
                            <Avatar name={user?.username} size="24" round />
                        )}
                    </div>
                    <div className="flex flex-col md:flex-row md:gap-[6px] md:items-center">
                        <span className="inline-block font-extrabold text-xs">
                            {user?.username}
                        </span>
                        <FaCircle
                            className="hidden md:block text-neutral-600"
                            size={4}
                        />
                        <span className="inline-block font-body text-xs text-neutral-600">
                            {moment(created_at).fromNow()}
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
            <div className="flex flex-col gap-[18px]">
                <article>
                    <p className="text-xs font-body lg:pl-[36px]">{content}</p>
                </article>
                <div
                    className="flex items-center gap-2 w-fit cursor-pointer"
                    onClick={() => setShowComment((prev) => !prev)}
                    aria-hidden>
                    <FaRegComment className="scale-x-[-1]" size={18} />
                    <span className="font-body text-xs">{comment_counts}</span>
                </div>
            </div>
            <div className="flex flex-col gap-6 border-t-[1px] border-[#272727] pt-[18px]">
                <div className="flex gap-3 items-center">
                    <div className="relative w-[24px] h-[24px]">
                        {user?.photo_url ? (
                            <Image
                                src={user?.photo_url}
                                alt={user?.username}
                                layout="fill"
                                className="rounded-full object-contain"
                            />
                        ) : (
                            <Avatar
                                name={user?.username}
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
                    />
                </div>
                {showComment && (
                    <div className="flex flex-col gap-[18px]">
                        {DUMMY_COMMENT?.comments?.map(
                            ({ id, content, user }) => (
                                <ReplyComment
                                    key={id}
                                    content={content}
                                    user={user}
                                />
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnswerCard;
