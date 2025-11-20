import { useGetProblemInProblemSetQuery } from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';

const ProblemsetTitle = () => {
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
        <div className="w-full">
            <h3 className="lg:font-semibold text-sm lg:text-xl text-graphie-400 lg:text-white">
                Section {(problem?.problemset_order ?? 0) + 1}:{' '}
                {problem?.problemset_name}
            </h3>
        </div>
    );
};

export default ProblemsetTitle;
