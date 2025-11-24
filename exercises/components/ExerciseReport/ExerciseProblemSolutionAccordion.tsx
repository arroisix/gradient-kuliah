import { useState } from 'react';
import { ChevronDown, ChevronUp, Minimize2 } from 'lucide-react';
import { cn } from 'commons/utils';
import TiptapViewer from 'courses/components/Textbook/TiptapViewer';
import {
    useGetProblemInProblemSetQuery,
    useGetProblemSolutionQuery
} from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';

const ExerciseProblemSolutionAccordion = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const router = useRouter();
    const { slug, sectionId, problemsetId, problemId, exerciseProgressId } =
        router.query;

    const { data: problem } = useGetProblemInProblemSetQuery(
        {
            slug: slug as string,
            problemSetId: (sectionId as string) || (problemsetId as string),
            problemId: problemId as string,
            exercise_progress_id: exerciseProgressId as string
        },
        { skip: !slug || (!sectionId && !problemsetId) || !problemId }
    );

    const { data: solutionData } = useGetProblemSolutionQuery(
        {
            slug: slug as string,
            problem_progress_id: problem?.problem_progress?.id as string
        },
        {
            skip:
                !slug ||
                (!problemsetId && !sectionId) ||
                !problem?.problem_progress?.id
        }
    );

    if (!solutionData?.solution) {
        return null;
    }

    return (
        <div className="bg-violet-1 rounded-2xl lg:relative lg:border-none">
            {/* Accordion Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-4 lg:px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <h3 className="text-white font-semibold text-base lg:text-lg">
                    Pembahasan Detail
                </h3>
                <div className="flex items-center gap-2">
                    {isExpanded ? (
                        <ChevronUp size={20} className="text-[#B6A6F3]" />
                    ) : (
                        <ChevronDown size={20} className="text-[#B6A6F3]" />
                    )}
                </div>
            </button>

            {/* Accordion Content */}
            <div
                className={cn(
                    'overflow-hidden transition-all duration-300 ease-in-out',
                    isExpanded ? 'max-h-[70vh] lg:max-h-[500px]' : 'max-h-0'
                )}>
                <div className="px-4 lg:px-6 py-6 overflow-y-auto max-h-[60vh] lg:max-h-[450px]">
                    <TiptapViewer
                        content={solutionData?.solution}
                        className="text-left lg:text-xl"
                    />
                </div>
            </div>
        </div>
    );
};

export default ExerciseProblemSolutionAccordion;
