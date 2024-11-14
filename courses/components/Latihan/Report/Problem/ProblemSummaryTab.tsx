import React from 'react';
import {
    ProblemReport,
    RecommendedMaterial
} from '../../../../types/exercises';
import { FaRegCirclePlay } from 'react-icons/fa6';
import { BiSolidStar } from 'react-icons/bi';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTracker } from '../../../../../tracker/tracker';

interface ProblemSummaryTabProps {
    data: ProblemReport;
}

const ProblemSummaryTab: React.FC<ProblemSummaryTabProps> = ({ data }) => {
    return (
        <div className="w-full h-full flex flex-col space-y-4">
            <div className="bg-[#252A31] rounded-lg p-4 flex flex-row items-center gap-4">
                <div className="text-white text-4xl font-bold">
                    {data.performance.percentile.toFixed(1)}%
                </div>
                <div className="text-[#BBBBBB] text-sm">
                    {data.performance.message}
                </div>
            </div>

            {(data.topics_to_review.subchapters.length > 0 ||
                data.topics_to_review.chapter.length > 0) && (
                <div className="bg-[#252A31] rounded-lg p-4 border-t-2 border-[#EB5D49]">
                    <h3 className="text-white font-semibold mb-2 flex items-center">
                        🚨 Perlu Belajar Lagi
                    </h3>
                    <div className="mb-2">
                        <div className="text-white text-sm font-semibold mb-2">
                            Chapter
                        </div>
                        {data.topics_to_review.chapter ? (
                            <div className="bg-[#4B4E5F] text-white px-3 py-1 rounded-full text-sm inline-block">
                                {data.topics_to_review.chapter}
                            </div>
                        ) : (
                            <div className="text-green-400 text-sm">
                                Hebat! Tidak ada Chapter yang perlu kamu
                                pelajari lagi
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="text-white text-sm font-semibold mb-2">
                            Subchapter
                        </div>
                        {data.topics_to_review.subchapters.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {data.topics_to_review.subchapters.map(
                                    (subchapter, index) => (
                                        <div
                                            key={index}
                                            className="bg-[#4B4E5F] text-white px-3 py-1 rounded-full text-sm">
                                            {subchapter}
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <div className="text-green-400 text-sm">
                                Hebat! Tidak ada Subchapter yang perlu kamu
                                pelajari lagi
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="bg-[#252A31] rounded-lg p-4">
                <h3 className="text-white font-semibold mb-4">
                    Rekomendasi Materi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.recommended_materials.map((material, index) => (
                        <RecommendationCard key={index} material={material} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const RecommendationCard: React.FC<{ material: RecommendedMaterial }> = ({
    material
}) => {
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

const BookCard: React.FC<{ material: RecommendedMaterial }> = ({
    material
}) => (
    <>
        <div className="relative w-[108px] h-40 flex-shrink-0">
            <Image
                src={material.thumbnail}
                alt={material.name}
                layout="fill"
                objectFit="cover"
            />
        </div>
        <div className="p-3 flex flex-col justify-between items-start flex-grow">
            <h4 className="text-white text-sm font-medium line-clamp-2">
                {material.name}
            </h4>
            <div className="flex items-center mt-1">
                <BiSolidStar className="text-yellow-400 mr-1" />
                <span className="text-white text-xs">
                    {material.rating?.toFixed(1)}
                </span>
            </div>
            <div className="mt-2">
                <span
                    className={`text-white text-xs font-semibold px-2 py-1 rounded-full ${
                        material.book_type === 'bank-soal'
                            ? 'bg-[#0083FF]'
                            : 'bg-[#CC009E]'
                    }`}>
                    {material.book_type === 'bank-soal'
                        ? 'Bank Soal'
                        : 'Astronotes'}
                </span>
            </div>
        </div>
    </>
);

const CourseOrVideoCard: React.FC<{ material: RecommendedMaterial }> = ({
    material
}) => (
    <div className="flex flex-col w-full">
        <div className="relative w-full h-[108px]">
            <Image
                src={material.thumbnail}
                alt={material.name}
                layout="fill"
                objectFit="cover"
            />
            {material.type === 'Video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <FaRegCirclePlay className="text-white text-3xl" />
                </div>
            )}
        </div>
        <div className="p-3 flex-grow">
            <h4 className="text-white text-sm font-medium line-clamp-1 text-left">
                {material.name}
            </h4>
        </div>
    </div>
);

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

export default ProblemSummaryTab;
