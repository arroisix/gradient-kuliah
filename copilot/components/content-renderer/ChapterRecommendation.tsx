import { useAuth } from 'authentication/contexts/AuthProvider';
import { CDN_URL } from 'commons/constants';
import { ContentRecommendationType } from 'copilot/types/copilot';
import Image from 'next/image';
import Link from 'next/link';

interface ChapterRecommendationProps {
    type: ContentRecommendationType;
    title: string;
    course_slug: string;
    chapter_slug: string;
    subchapter_slug: string;
}

function ChapterRecommendation({
    type,
    title,
    course_slug,
    chapter_slug,
    subchapter_slug
}: ChapterRecommendationProps): JSX.Element {
    const { profile } = useAuth();

    const generateURL = () => {
        if (type === 'tryout') {
            return `/latihan/${course_slug}`;
        }

        if (type === 'course') {
            return profile?.current_role === 'COLLEGE_STUDENT'
                ? `/kelas/${course_slug}/${subchapter_slug}`
                : `/utbk/materi/${course_slug}/${chapter_slug}/${subchapter_slug}`;
        }

        return `/utbk/materi/${course_slug}/${chapter_slug}/${subchapter_slug}`;
    };

    return (
        <Link
            key={
                type === 'chapter'
                    ? `${course_slug}:${subchapter_slug}`
                    : subchapter_slug
            }
            href={generateURL()}
            target="_blank"
            rel="noopener noreferrer"
            className="carousel-item relative w-[177px] h-[119px] rounded-lg p-4 border border-[#4B4E5F]/80 overflow-hidden flex justify-center items-end">
            <Image
                src={`${CDN_URL}/assets/utbk/chapter_recommendation.png`}
                alt=""
                layout="fill"
                className="object-cover object-center"
            />

            <h3 className="relative z-10 text-white font-semibold text-center text-sm leading-tight">
                {title}
            </h3>
        </Link>
    );
}

export { ChapterRecommendation };
