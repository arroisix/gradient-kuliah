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

    const { isLoading } = useGetProblemsetDetailInterstitialQuery(
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

    return (
        <LatihanLayout>
            {/* Mobile View */}
            <div className="lg:hidden flex flex-col h-full bg-black">
                <ExerciseProblemSetHeader />
                <div className="flex-1 overflow-y-auto px-4">
                    <ProblemSetRoadmap />
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:flex flex-col h-full gap-6 overflow-hidden">
                <ExerciseProblemSetHeader />
                <div className="flex w-full gap-10 flex-col lg:flex-row flex-shrink-0 h-full overflow-y-auto">
                    <div className="w-1/2">
                        <ProblemSetRoadmap />
                    </div>
                    <div className="w-1/2 sticky top-0 h-fit">
                        <ProblemSetInformation maxWidth="100%" />
                    </div>
                </div>
            </div>
        </LatihanLayout>
    );
};

export default ExerciseProblemSetDetail;
