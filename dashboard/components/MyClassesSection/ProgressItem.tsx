import { AstronoteBookCard } from 'courses/components/LearningExperience/AstroNotes/AstronoteBook';
import { useGetBookDetailQuery } from 'courses/redux/api/astronotesApi';
import React from 'react';

type ProgressItemProps = {
    progress: ClassProgress;
    courseName: string;
};

const ProgressItem = ({
    progress,
    courseName
}: ProgressItemProps): JSX.Element => {
    const { book_slug } = progress;
    const { data: getBookDetail } = useGetBookDetailQuery(
        { slug: book_slug },
        { skip: !book_slug }
    );

    const getHref = (): string => {
        switch (progress.type) {
            case 'book':
                return getBookDetail?.book.category.toLowerCase() === 'catatan'
                    ? `/perpustakaan/astronotes/${book_slug}/${progress.latest_page}`
                    : `/perpustakaan/bank-soal/${book_slug}/${progress.latest_page}`;
            case 'textbook':
                return `/perpustakaan/textbook/${book_slug}/${progress.latest_page}`;
            case 'video':
                return `/kelas/${progress.course_slug}/belajar/video/${progress.chapter_id}/${progress.subchapter_id}`;
            default:
                return '?';
        }
    };
    return (
        <AstronoteBookCard
            key={progress.id}
            slug={book_slug}
            book_cover_url={progress.thumbnail}
            category_name=""
            title={progress.title}
            percentage_progress={progress.percentage_progress}
            last_chapter_read={progress.latest_chapter}
            type={progress.type}
            id={progress.id}
            rating={0}
            category_id=""
            is_free
            is_public
            in_progress
            href={getHref()}
            imageClassname="min-h-24 lg:min-h-16"
            eventName='User click item on "Kelasku" Accordion'
            eventPayload={{
                Course: courseName,
                Title: progress.title,
                Type: progress.type
            }}
        />
    );
};
export default ProgressItem;
