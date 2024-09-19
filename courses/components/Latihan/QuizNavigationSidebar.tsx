import React from 'react';
import { IoClose } from 'react-icons/io5';
import { useRouter } from 'next/router';
import { useGetProblemSetDetailQuery } from '../../redux/api/exercisesApi';
import Link from 'next/link';

interface QuizNavigationSidebarProps {
    onClose: () => void;
}

const QuizNavigationSidebar: React.FC<QuizNavigationSidebarProps> = ({
    onClose
}) => {
    const router = useRouter();
    const { slug, sectionId: problemSetId, problemId } = router.query;

    const {
        data: problemSetData,
        isLoading,
        error
    } = useGetProblemSetDetailQuery(problemSetId as string);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading problem set data</div>;
    if (!problemSetData) return null;

    const { name, problems, answered_problems, unanswered_problems } =
        problemSetData;

    return (
        <div className="fixed top-0 left-0 w-[240px] h-full bg-[#1B2129] flex flex-col">
            <div className="w-full h-[56px] px-4 py-4 flex gap-3 items-center">
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white">
                    <IoClose size={24} />
                </button>
                <h2 className="text-white text-lg font-semibold">
                    Quiz Navigation
                </h2>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                <h3 className="text-white text-sm mb-4">{name}</h3>
                <div className="grid grid-cols-4 gap-2 mb-4">
                    {problems.map((problem) => (
                        <Link
                            key={problem.id}
                            href={`/latihan/${slug}/${problemSetId}/${problem.id}`}
                            passHref>
                            <a
                                className={`w-10 h-10 rounded-md flex items-center justify-center text-sm
                                    ${
                                        problem.id === problemId
                                            ? 'bg-white text-[#222222]'
                                            : problem.is_answered
                                            ? 'bg-[#4B4E5F] text-white'
                                            : 'bg-transparent border border-[#666666] text-white'
                                    }`}>
                                {problem.order + 1}
                            </a>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="text-white text-sm p-4 border-t border-gray-700">
                <p className="flex items-center mb-2">
                    <span className="w-4 h-4 mr-2 inline-block bg-[#4B4E5F] rounded-sm"></span>
                    Soal Dikerjakan : {answered_problems}
                </p>
                <p className="flex items-center">
                    <span className="w-4 h-4 mr-2 inline-block border border-[#666666] rounded-sm"></span>
                    Soal Kosong : {unanswered_problems}
                </p>
            </div>
        </div>
    );
};

export default QuizNavigationSidebar;
