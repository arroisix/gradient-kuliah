import { AstronoteBookCard } from 'courses/components/LearningExperience/AstroNotes/AstronoteBook';
import { getBookBaseHref } from 'courses/utils';
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

    const progressTypeMap: { [key: string]: string } = {
        video: 'Video',
        book: 'Catatan',
        bank_soal: 'Bank Soal',
        textbook: 'Textbook'
    };

    const getHref = (): string => {
        switch (progress.type) {
            case 'book':
                return `${getBookBaseHref(progress.type)}/${book_slug}/${
                    progress.latest_page
                }`;
            case 'textbook':
            case 'bank_soal':
                return `${getBookBaseHref(progress.type)}/${book_slug}/${
                    progress.latest_problem
                }`;
            case 'video':
                return `/kelas/${progress.course_slug}/${progress.subchapter_slug}`;
            default:
                return '?';
        }
    };
    return (
        <AstronoteBookCard
            key={progress.id}
            slug={book_slug}
            book_cover_url={progress.thumbnail}
            category_name={progressTypeMap[progress.type]}
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
            imageClassname="min-w-20 min-h-24 lg:min-h-16"
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
