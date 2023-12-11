import Link from 'next/link';
import React from 'react';
import { AiOutlineEye } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';

type SimilarQuestionProps = {
    question: ExploreQuestion;
};

const SimilarQuestion = ({ question }: SimilarQuestionProps): JSX.Element => {
    return (
        <Link
            key={question.slug}
            href={`/komunitas/${encodeURIComponent(question.slug)}`}
            className="flex flex-col gap-4 p-3 text-xs rounded-lg shadow-lg bg-neutral-800">
            <p className="overflow-hidden text-ellipsis ">{question.content}</p>
            <div className="flex justify-between">
                <p className="font-bold">{question.category_name}</p>
                <div className="flex items-center gap-6 font-body">
                    <div className="flex items-center gap-2">
                        <AiOutlineEye size={18} />
                        <p>{question.viewer_count}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaRegComment className="scale-x-[-1]" size={18} />
                        <p>{question.comment_count}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default SimilarQuestion;
