import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useRouter } from 'next/router';
import { useGetProblemSetDetailQuery } from '../../redux/api/exercisesApi';
import Link from 'next/link';

interface QuizNavigationSidebarProps {
    onClose: () => void;
    isOpen: boolean;
}

const QuizNavigationSidebar: React.FC<QuizNavigationSidebarProps> = ({
    onClose,
    isOpen
}) => {
    const router = useRouter();
    const { slug, sectionId: problemSetId, problemId } = router.query;
    const [isRendered, setIsRendered] = useState(false);

    const {
        data: problemSetData,
        isLoading,
        error
    } = useGetProblemSetDetailQuery(problemSetId as string, {
        skip: !problemSetId || !isOpen,
        refetchOnMountOrArgChange: true
    });

    useEffect(() => {
        if (isOpen && problemSetId) {
            setIsRendered(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => {
                setIsRendered(false);
            }, 300);
            document.body.style.overflow = '';
            return () => clearTimeout(timer);
        }
        return;
    }, [isOpen, problemSetId]);

    if (!isRendered) return null;

    if (isLoading) return <div className="hidden">Loading...</div>;
    if (error)
        return <div className="hidden">Error loading problem set data</div>;
    if (!problemSetData) return null;

    const { name, problems, answered_problems, unanswered_problems } =
        problemSetData;

    return (
        <div
            className={`fixed inset-0 bg-[#1B2129] flex flex-col transition-transform duration-300 ease-in-out z-50
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:w-[240px] md:right-auto`}>
            <div className="w-full h-[56px] px-4 py-4 flex gap-3 items-center border-b border-gray-700">
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
                <div className="grid grid-cols-5 md:grid-cols-4 gap-2 mb-4">
                    {problems.map((problem) => (
                        <Link
                            key={problem.id}
                            href={`/latihan/${slug}/${problemSetId}/${problem.id}`}
                            passHref>
                            <a
                                className={`w-full aspect-square rounded-md flex items-center justify-center text-sm
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
