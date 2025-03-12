import { getBookBaseHref } from 'courses/utils';
import SearchResultCard from 'dashboard/components/Search/SearchResults/SearchResultCard';
import React from 'react';
import Skeleton from 'commons/components/elements/Skeleton';
import { useRouter } from 'next/router';
import { cn } from 'commons/utils';
import EmptyResult from './EmptyResult';
import LatihanCard from 'latihan/components/Entrypoint/LatihanCard';
import FlashcardSearchResultCard from './FlashcardSearchResultCard';

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
        community: 'Diskusi',
        exercise: 'Kuis',
        flashcard: 'Konten Flashcard'
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
                {type === 'exercise' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Skeleton repeat={9} isCustomSize className="h-40" />
                    </div>
                ) : (
                    <Skeleton repeat={4} isCustomSize className="w-full h-40" />
                )}
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
            {type === 'exercise' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result?.hits.map((hit) => (
                        <ResultsCardFactory key={hit.document.id} hit={hit} />
                    ))}
                </div>
            ) : (
                result?.hits.map((hit) => (
                    <ResultsCardFactory key={hit.document.id} hit={hit} />
                ))
            )}
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
                    desc={getHighlight('page_content') ?? ''}
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
                    desc={getHighlight('problem_solution') ?? ''}
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

        case 'exercise':
            if (
                !doc.exercise_slug ||
                !doc.exercise_title ||
                !doc.problem_count
            ) {
                return <></>;
            }
            return (
                <LatihanCard
                    key={doc.id}
                    exercise={{
                        id: doc.id,
                        slug: doc.exercise_slug,
                        title: doc.exercise_title,
                        subject: doc.course_name || '',
                        total_questions: doc.problem_count,
                        icon: doc.icon || '📚',
                        status: doc.is_answered ? 'COMPLETED' : undefined,
                        is_free: true
                    }}
                    cardType="allExercises"
                />
            );

        case 'flashcard_card':
            if (!doc.flashcard_slug || !doc.flashcard_title) {
                return <></>;
            }
            return (
                <FlashcardSearchResultCard
                    key={doc.id}
                    href={`/flashcard/${doc.flashcard_slug}/study?index=${
                        doc.order ? doc.order + 1 : 0
                    }`}
                    title={
                        getHighlight('flashcard_title') ?? doc.flashcard_title
                    }
                    normal_title={doc.flashcard_title}
                    question={
                        getHighlight('card_question') ?? doc.card_question ?? ''
                    }
                    answer={
                        getHighlight('card_answer') ?? doc.card_answer ?? ''
                    }
                    attachments={doc.attachments}
                    author={
                        doc.lecturers_or_authors?.[0]
                            ? {
                                  name: doc.lecturers_or_authors[0],
                                  photo_profile: doc.photo_profile || ''
                              }
                            : undefined
                    }
                    order={doc.order}
                />
            );

        default:
            return <></>;
    }
};

export default SearchResultsSection;
