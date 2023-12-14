import Skeleton from 'commons/components/elements/Skeleton';
import { ListContinueLearning } from './ListContinueLearning';
import { NoLearningProgress } from './NoLearningProgress';

const ContinueLearning = ({
    className,
    isLoading,
    learningProgress
}: {
    isLoading: boolean;
    learningProgress?: StudentLearningProgress[];
} & PropsWithClassName): JSX.Element => {
    return (
        <div className={`flex flex-col gap-3 md:gap-5 ${className}`}>
            <h3 className="text-lg font-extrabold">Lanjut Belajar</h3>
            {isLoading ? (
                <Skeleton
                    className="w-full rounded-lg h-44 bg-neutral-800 animate-pulse"
                    repeat={3}
                />
            ) : learningProgress?.length === 0 ? (
                <NoLearningProgress />
            ) : (
                <ListContinueLearning learningProgress={learningProgress} />
            )}
        </div>
    );
};

export default ContinueLearning;
