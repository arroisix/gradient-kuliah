import React from 'react';
import Skeleton from 'commons/components/elements/Skeleton';
import Link from 'next/link';
import LatihanLayout from '../../containers/LatihanLayout';
import { useGetExerciseDetailQuery } from '../../redux/api/exercisesApi';
import { useTracker } from 'tracker/tracker';

interface SectionPageContentProps {
    slug: string;
    sectionId: string;
}

const SectionPageContent: React.FC<SectionPageContentProps> = ({
    slug,
    sectionId
}) => {
    const tracker = useTracker();
    const { data: exerciseDetail, isLoading } = useGetExerciseDetailQuery(
        { exercise_slug: slug },
        { skip: !slug }
    );

    const handleStartSection = (): void => {
        tracker?.genericTrack('Click Start Latihan Section Button', {
            EXERCISE_SLUG: slug,
            SECTION_SLUG: sectionId
        });
    };

    if (isLoading) {
        return (
            <LatihanLayout>
                <Skeleton className="w-full h-full" />
            </LatihanLayout>
        );
    }

    if (!exerciseDetail) {
        return (
            <LatihanLayout>
                <div>Exercise not found</div>
            </LatihanLayout>
        );
    }

    const currentSection = exerciseDetail.problem_sets.find(
        (set) => set.id === sectionId
    );

    if (!currentSection) {
        return (
            <LatihanLayout>
                <div>Section not found</div>
            </LatihanLayout>
        );
    }

    const firstProblemId =
        currentSection.problem_count > 0
            ? currentSection.first_problem_id
            : null;

    return (
        <LatihanLayout>
            <div className="flex flex-col items-center justify-between h-full text-center">
                <div className="flex flex-col items-center gap-3 pt-4">
                    <h2 className="text-2xl font-semibold text-white">
                        {currentSection.name}
                    </h2>
                    <p className="text-gray-400">
                        Dengan menekan Mulai Latihan kamu akan langsung
                        diarahkan ke soal pertama
                    </p>
                </div>
                {firstProblemId && (
                    <Link
                        replace
                        className="w-full"
                        href={`/exercises/${slug}/${sectionId}/${firstProblemId}`}
                        onClick={handleStartSection}>
                        <button className="w-full bg-[#7F56D9] text-white py-3 rounded-full font-semibold hover:bg-[#6941C6] transition-colors">
                            Mulai Latihan
                        </button>
                    </Link>
                )}
            </div>
        </LatihanLayout>
    );
};

export default SectionPageContent;
