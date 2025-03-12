import React from 'react';
import { RecommendedMaterial } from '../../../types/exercises';
import { useTracker } from '../../../../tracker/tracker';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { BookCard } from './BookCard';
import { CourseOrVideoCard } from './CourseOrVideoCard';

export const RecommendationCard: React.FC<{
    material: RecommendedMaterial;
}> = ({ material }) => {
    const tracker = useTracker();
    const router = useRouter();
    const { slug, exerciseProgressId, problemId } = router.query;
    const isBook = material.type === 'Book';
    const href = getHref(material);

    const handleClick = () => {
        tracker?.genericTrack('Click Material Recomendation Card', {
            EXERCISE_SLUG: slug as string,
            PROGRESS_ID: exerciseProgressId as string,
            PROBLEM_ID: problemId as string,
            CARD_LINK: getHref(material),
            CARD_TYPE: material.type
        });
    };

    return (
        <Link href={href}>
            <button
                className={`flex rounded-lg overflow-hidden h-40 w-full ${
                    isBook ? 'bg-[#222222]' : 'bg-[#121212]'
                } border border-[#666666]`}
                onClick={handleClick}>
                {isBook ? (
                    <BookCard material={material} />
                ) : (
                    <CourseOrVideoCard material={material} />
                )}
            </button>
        </Link>
    );
};

const getHref = (material: RecommendedMaterial): string => {
    switch (material.type) {
        case 'Course':
            return `/kelas/${material.slug}`;
        case 'Video':
            return `/kelas/${material.course_slug}/${material.slug}`;
        case 'Book':
            return `/perpustakaan/${material.book_type}/${material.slug}`;
        default:
            return '#';
    }
};
