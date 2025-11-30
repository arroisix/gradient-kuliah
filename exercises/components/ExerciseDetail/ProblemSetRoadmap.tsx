import { useGetProblemsetDetailInterstitialQuery } from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';
import { Check } from 'lucide-react';
import { cn } from 'commons/utils';
import Skeleton from 'commons/components/elements/Skeleton';
import ProblemSetInformation from './ProblemSetInformation';

const ProblemSetRoadmap = () => {
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
            <div className="w-full lg:w-1/2 bg-neutral-800 rounded-lg p-6">
                <Skeleton className="h-6 w-32 !mb-4" />
                <div className="flex flex-col gap-4">
                    <Skeleton repeat={4} className="h-16 !mb-2" />
                </div>
            </div>
        );
    }

    if (!problemsets?.data || problemsets.data.length === 0) {
        return null;
    }

    const currentIndex = problemsets.data.findIndex((item) => item.is_current);

    return (
        <div className="w-full lg:w-1/2 rounded-lg lg:p-6 py-4 overflow-auto">
            <h2 className="text-white text-lg font-semibold mb-6 hidden lg:block">
                Quiz Section
            </h2>
            <div className="flex flex-col">
                {problemsets.data.map((section, index) => {
                    const isCompleted = index < currentIndex;
                    const isCurrent = section.is_current;
                    const isLocked = index > currentIndex;

                    return (
                        <div
                            key={section.id}
                            className="flex items-start gap-3">
                            {/* Vertical Line and Circle */}
                            <div className="flex flex-col items-center">
                                {/* Circle Icon */}
                                <div
                                    className={cn(
                                        'w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10',
                                        isCompleted &&
                                            'bg-[#B6A6F3] border-2 border-[#B6A6F3]',
                                        isCurrent &&
                                            'bg-transparent border-2 border-white',
                                        isLocked &&
                                            'bg-transparent border-2 border-gray-600'
                                    )}>
                                    {isCompleted ? (
                                        <Check className="w-3 h-3 text-white" />
                                    ) : (
                                        <div
                                            className={cn(
                                                'w-3 h-3 rounded-full',
                                                isCurrent && 'bg-white',
                                                isLocked && 'bg-transparent'
                                            )}
                                        />
                                    )}
                                </div>

                                {/* Vertical Line */}
                                {index < problemsets.data.length && (
                                    <div
                                        className={cn(
                                            isCurrent
                                                ? 'w-0.5 lg:h-[54px] h-[250px]'
                                                : 'w-0.5 h-[54px]',
                                            isCompleted
                                                ? 'bg-[#B6A6F3]'
                                                : 'bg-gray-600 border-dashed border-l-2 border-gray-600'
                                        )}
                                        style={{
                                            borderStyle: !(
                                                isCompleted || isCurrent
                                            )
                                                ? 'dashed'
                                                : 'solid'
                                        }}
                                    />
                                )}
                            </div>

                            {/* Section Content */}
                            <div className="flex-1">
                                <p
                                    className={cn(
                                        'text-sm mb-1',
                                        isCompleted || isCurrent
                                            ? 'text-gray-400'
                                            : 'text-gray-600'
                                    )}>
                                    Section {section.order + 1}
                                </p>
                                <h3
                                    className={cn(
                                        'text-base font-semibold',
                                        isCompleted
                                            ? 'text-[#B6A6F3]'
                                            : isCurrent
                                            ? 'text-white'
                                            : 'text-gray-600'
                                    )}>
                                    {section.title}
                                </h3>

                                {/* Mobile Info Card - only show for current section */}
                                {isCurrent && (
                                    <div className="lg:hidden mt-4 mb-2">
                                        <ProblemSetInformation />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div key={'done'} className="flex items-start gap-3">
                    {/* Vertical Line and Circle */}
                    <div className="flex flex-col items-center">
                        {/* Circle Icon */}
                        <div
                            className={cn(
                                'w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10',
                                'bg-transparent border-2 border-white'
                            )}>
                            <Check className="w-5 h-5 text-black" />
                        </div>
                    </div>

                    {/* Section Content */}
                    <div className="flex-1 pb-8">
                        <h3
                            className={cn(
                                'text-base font-semibold',
                                'text-gray-600'
                            )}>
                            Selesai
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemSetRoadmap;
