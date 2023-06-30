import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Avatar from 'react-avatar';
import { AiOutlineEye } from 'react-icons/ai';
import { FaCircle, FaRegComment } from 'react-icons/fa';

type Student = {
    id: string;
    photo_url: string;
    username: string;
};

const QuestionCard = ({
    clickable,
    id,
    content,
    viewer_counts,
    comment_counts,
    created_at,
    student
}: {
    clickable: boolean;
    id: string;
    content: string;
    viewer_counts: number;
    comment_counts: number;
    created_at: number;
    student: Student;
}): JSX.Element => {
    const router = useRouter();

    return (
        <div
            className={`w-full border-[1px] border-neutral-800 rounded-xl p-[18px] md:p-5 ${
                clickable ? 'cursor-pointer' : ''
            }`}
            onClick={
                clickable ? () => router.push(`/komunitas/${id}`) : undefined
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
                        {moment(created_at).fromNow()}
                    </span>
                </div>
            </div>
            <article className="pt-[12px] pb-[18px] lg:pl-[36px]">
                <p className="text-xs font-body">{content}</p>
            </article>
            <div className="flex justify-between">
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
                <button className="bg-neutral-800 px-[27px] py-[7.5px] rounded-[70px] font-extrabold text-xs hover:bg-accent-purple transition-all">
                    Jawab
                </button>
            </div>
        </div>
    );
};

export default QuestionCard;
