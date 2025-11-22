import TiptapViewer from 'courses/components/Textbook/TiptapViewer';
import { useGetProblemInProblemSetQuery } from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';

const QuestionContent = () => {
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

    return (
        <div className="flex flex-col gap-2 w-full h-full lg:overflow-y-auto">
            <h2 className="lg:font-semibold text-sm lg:text-2xl text-white">
                Nomor {(problem?.problem?.order ?? 0) + 1}
            </h2>
            <TiptapViewer
                content={problem?.problem.question}
                className="lg:!text-xl text-white"
            />
        </div>
    );
};

export default QuestionContent;
