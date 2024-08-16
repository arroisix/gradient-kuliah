import { getBookBaseHref } from 'courses/utils';
import SearchResultCard from 'dashboard/components/Search/SearchResults/SearchResultCard';
import React from 'react';
import Skeleton from 'commons/components/elements/Skeleton';
import { useRouter } from 'next/router';
import { cn } from 'commons/utils';
import EmptyResult from './EmptyResult';

const SearchResultsSection = ({
    result,
    isLoading
}: SearchResultsProps): JSX.Element => {
    const router = useRouter();
    const { type } = router.query as { type: string };

    const headingMap: { [key: string]: string } = {
        course: 'Video Kelas',
        astronotes: 'Konten Astronotes',
        'bank-soal': 'Konten Bank Soal',
        'text-book': 'Textbook Solution',
        community: 'Diskusi'
    };

    if (isLoading)
        return (
            <div className="flex flex-col gap-4 py-6">
                <p
                    className={cn(
                        (!type || type == 'all') && 'hidden',
                        'font-bold'
                    )}>
                    {headingMap[type]} Terkait
                </p>
                <Skeleton repeat={4} isCustomSize className="w-full h-40" />
            </div>
        );

    if (result?.found === 0) return <EmptyResult />;

    return (
        <div className="flex flex-col gap-4 py-6">
            <p
                className={cn(
                    (!type || type == 'all') && 'hidden',
                    'font-bold'
                )}>
                {headingMap[type]} Terkait
            </p>
            {result?.hits.map((hit) => (
                <ResultsCardFactory key={hit.document.id} hit={hit} />
            ))}
        </div>
    );
};

const ResultsCardFactory = ({
    hit
}: {
    hit: SearchHits<SearchDocument>;
}): JSX.Element => {
    if (!hit) return <></>;

    const { document: doc } = hit;
    const type = doc.type;

    const getHighlight = (key: string): string | undefined =>
        hit.highlight[key]?.snippet;

    switch (type) {
        case 'course_video':
            return (
                <SearchResultCard
                    key={doc.id}
                    href={`/kelas/${doc.course_slug}/${doc.subchapter_slug}`}
                    title={
                        getHighlight('subchapter_name') ?? doc.subchapter_name
                    }
                    type={type}
                    desc={
                        getHighlight('transcript') ??
                        getHighlight('description') ??
                        ''
                    }
                    course={doc.course_name}
                    chapter={getHighlight('chapter_name') ?? doc.chapter_name}
                    thumbnail={doc.thumbnail}
                    duration={doc.duration}
                />
            );

        case 'astronotes_content':
            return (
                <SearchResultCard
                    key={doc.id}
                    href={`${getBookBaseHref('astronotes')}/${doc.book_slug}/${
                        doc.book_page
                    }`}
                    title={
                        getHighlight('subchapter_name') ?? doc.subchapter_name
                    }
                    type={type}
                    desc={getHighlight('content') ?? ''}
                    course={doc.course_name}
                    chapter={getHighlight('chapter_name') ?? doc.chapter_name}
                    thumbnail={doc.thumbnail}
                />
            );

        case 'bank_soal_problem':
            return (
                <SearchResultCard
                    key={doc.id}
                    href={`${getBookBaseHref('bank-soal')}/${doc.book_slug}/${
                        doc.problem_slug
                    }`}
                    title={
                        getHighlight('problem_question') ?? doc.problem_question
                    }
                    type={type}
                    desc={getHighlight('solution') ?? ''}
                    course={doc.course_name}
                    chapter={getHighlight('chapter_name') ?? doc.chapter_name}
                    subchapter={
                        getHighlight('subchapter_name') ?? doc.subchapter_name
                    }
                    thumbnail={doc.thumbnail}
                />
            );

        case 'textbook_problem':
            return (
                <SearchResultCard
                    key={doc.id}
                    href={`${getBookBaseHref('textbook')}/${doc.book_slug}/${
                        doc.problem_slug
                    }`}
                    title={
                        getHighlight('problem_solution') ?? doc.problem_solution
                    }
                    type={type}
                    desc={`${doc.book_name} — ${doc.problem_title}`}
                    course={getHighlight('course_name') ?? doc.course_name}
                    chapter={getHighlight('chapter_name') ?? doc.chapter_name}
                    subchapter={
                        getHighlight('subchapter_name') ?? doc.subchapter_name
                    }
                    thumbnail={doc.thumbnail}
                />
            );

        case 'community_post':
            return (
                <SearchResultCard
                    key={doc.id}
                    href={`/komunitas/${doc.problem_slug}`}
                    type={type}
                    title={
                        getHighlight('problem_question') ?? doc.problem_question
                    }
                    desc={
                        getHighlight('problem_solution') ?? doc.problem_solution
                    }
                    course={doc.course_name}
                    thumbnail={doc.thumbnail}
                    isAnswered={doc.is_answered}
                    commentCount={doc.popularity}
                />
            );

        default:
            return <></>;
    }
};

export default SearchResultsSection;
