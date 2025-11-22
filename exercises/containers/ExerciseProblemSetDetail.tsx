import { useRouter } from 'next/router';
import Skeleton from 'commons/components/elements/Skeleton';
import { useGetProblemsetDetailInterstitialQuery } from 'exercises/redux/api/exercisesApi';
import LatihanLayout from './LatihanLayout';
import ProblemSetInformation from 'exercises/components/ExerciseDetail/ProblemSetInformation';
import ExerciseProblemSetHeader from 'exercises/components/Header/ExerciseProblemSetHeader';
import ProblemSetRoadmap from 'exercises/components/ExerciseDetail/ProblemSetRoadmap';

const ExerciseProblemSetDetail = () => {
    const router = useRouter();
    const { slug, sectionId } = router.query;

    const { data: problemsets, isLoading } =
        useGetProblemsetDetailInterstitialQuery(
            { slug: slug as string, problemset_id: sectionId as string },
            {
                skip: !slug || !sectionId
            }
        );

    if (isLoading) {
        return (
            <LatihanLayout>
                <Skeleton className="w-full h-full" />
            </LatihanLayout>
        );
    }

    console.log('problemsets', problemsets);

    return (
        <LatihanLayout>
            <div className="flex flex-col h-full gap-6 overflow-hidden">
                <ExerciseProblemSetHeader />
                <div className="flex w-full gap-10 flex-col lg:flex-row flex-shrink-0 h-full">
                    <ProblemSetRoadmap />
                    <ProblemSetInformation />
                </div>
            </div>
        </LatihanLayout>
    );
};

export default ExerciseProblemSetDetail;
