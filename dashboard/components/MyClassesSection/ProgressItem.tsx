import ProductCard from 'commons/components/elements/ProductCard';
import { cn } from 'commons/utils';
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

    const product: Product = {
        title: progress.title,
        latestProgress: progress.percentage_progress,
        latestChapter: progress.latest_chapter,
        thumbnail: progress.thumbnail,
        inProgress: true
    };

    return (
        <ProductCard
            orientation="horizontal"
            category={progressTypeMap[progress.type]}
            href={getHref()}
            imageClassname={cn(
                'min-w-20 lg:min-h-16',
                progress.type == 'video' ? 'w-20 sm:w-24 xl:w-28' : 'min-h-24'
            )}
            product={product}
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
