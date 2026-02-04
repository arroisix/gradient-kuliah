import { CDN_URL } from 'commons/constants';
import Image from 'next/image';
import Link from 'next/link';

interface ChapterRecommendation {
    type: 'chapter' | 'subchapter';
    title: string;
    course_slug: string;
    chapter_slug: string;
    subchapter_slug: string;
}

interface ChapterRecommendationProps {
    data: ChapterRecommendation[];
}

function ChapterRecommendation({
    data
}: ChapterRecommendationProps): JSX.Element {
    return (
        <div className="carousel flex space-x-4">
            {data.map((v) => (
                <Link
                    key={
                        v.type === 'chapter'
                            ? `${v.chapter_slug}:${v.subchapter_slug}`
                            : v.subchapter_slug
                    }
                    href={`/utbk/materi/${v.course_slug}/${v.chapter_slug}/${v.subchapter_slug}`}
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
                        {v.title}
                    </h3>
                </Link>
            ))}
        </div>
    );
}

export { ChapterRecommendation };
