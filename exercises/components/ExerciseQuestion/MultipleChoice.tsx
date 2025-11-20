import TiptapViewer from 'courses/components/Textbook/TiptapViewer';
import { useGetProblemInProblemSetQuery } from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';
import { useState } from 'react';

const MultipleChoiceContainer = () => {
    const router = useRouter();
    const { slug, sectionId, problemId } = router.query;
    const { data: problem } = useGetProblemInProblemSetQuery(
        {
            slug: slug as string,
            problemSetId: sectionId as string,
            problemId: problemId as string
        },
        { skip: !slug || !sectionId || !problemId }
    );
    const [selectedAnswer, setSelectedAnswer] = useState<string[]>([]);

    return (
        <div className="flex flex-col gap-3 lg:overflow-y-auto">
            {problem &&
                problem.problem.options.map((option, index) => (
                    <div
                        key={index}
                        className="p-3 border border-purple-6 rounded-lg w-full flex justify-center items-center cursor-pointer bg-violet-1 hover:bg-violet-2">
                        <TiptapViewer
                            content={option.answer}
                            className="text-center"
                        />
                    </div>
                ))}
        </div>
    );
};
export default MultipleChoiceContainer;
