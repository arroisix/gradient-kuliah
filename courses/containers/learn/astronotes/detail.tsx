import Image from 'next/image';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';
import { GrStar } from 'react-icons/gr';
import { useTracker } from 'tracker/tracker';
import AstronotesKeyword from 'courses/components/LearningExperience/AstroNotes/Detail/AstronotesKeyword';
import Accordion from 'commons/components/elements/Accordion';
import ChapterContent from 'courses/components/LearningExperience/AstroNotes/Detail/ChapterContent';
import { TabStyle } from 'courses/components/LearningExperience/AstroNotes/constants';
import { useRouter } from 'next/router';
import { cn } from 'commons/utils';
import Button from 'commons/components/elements/Button';
import { useRef } from 'react';
import useOnScreen from 'commons/hooks/useOnScreen';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Skeleton from 'commons/components/elements/Skeleton';
import { useGetBookDetailQuery } from 'courses/redux/api/astronotesApi';

const AstronotesDetail = ({
    slug: serverSlug,
    astronotes: initialData
}: {
    slug: string;
    astronotes: BookDetailInterface;
}): JSX.Element => {
    const { query } = useRouter();
    const { slug } = query as { slug: string };
    const { data } = useGetBookDetailQuery(
        { slug },
        { skip: !slug && !serverSlug, refetchOnMountOrArgChange: true }
    );
    const astronotes = data?.book ?? initialData;
    const tracker = useTracker();

    return (
        <div className="mx-auto w-full lg:w-[75%] xl:w-[60%] flex flex-col gap-4 md:gap-6">
            <Breadcrumbs title={astronotes?.title} />
            <Tabs />

            <div
                id="details"
                className="flex flex-col items-center gap-4 scroll-mt-32 md:items-start md:flex-row md:gap-6 lg:gap-8">
                <div className="aspect-[256/364] relative min-w-[100px] md:min-w-[150px] max-w-[132px] md:max-w-[164px] h-auto w-[50%] border rounded border-neutral-700">
                    <Image
                        src={
                            astronotes?.cover_url ||
                            'https://assets.gradient.academy/assets/astronotes-kalkulus2-placeholder.jpg'
                        }
                        layout="fill"
                        objectFit="cover"
                        className="rounded"
                    />
                </div>
                <div className="flex flex-col items-center gap-4 md:items-start">
                    <h1 className="text-base font-extrabold text-white md:text-lg lg:text-xl">
                        {astronotes?.title ? (
                            astronotes.title
                        ) : (
                            <Skeleton
                                isCustomSize
                                className="w-32 h-4 md:h-5"
                            />
                        )}
                    </h1>

                    <div className="flex flex-col gap-2 text-sm lg:text-base">
                        {astronotes?.category === 'Textbook' && (
                            <>
                                <h2 className={'font-sans'}>
                                    {astronotes?.authors.join(', ')}
                                </h2>
                                {astronotes?.isbn && (
                                    <h2 className="font-sans text-[#999999]">{`ISBN: ${astronotes?.isbn}`}</h2>
                                )}
                            </>
                        )}
                        {astronotes ? (
                            <>
                                <div className="flex items-center gap-1">
                                    <GrStar className="text-[#999999] w-4 lg:w-5 h-4 lg:h-5" />

                                    <span className="font-sans text-[#999999]">
                                        {astronotes?.rating.toFixed(1)} dari{' '}
                                        {(astronotes?.feedback_total ?? 0) >
                                        10000
                                            ? '10000+'
                                            : astronotes?.feedback_total}{' '}
                                        penilaian
                                    </span>
                                </div>
                            </>
                        ) : (
                            <Skeleton
                                isCustomSize
                                repeat={4}
                                className="w-32 h-4 first:w-48"
                            />
                        )}
                    </div>

                    {astronotes ? (
                        astronotes?.keywords && (
                            <div className="flex justify-center md:justify-start flex-wrap gap-2.5 pt-3 lg:pt-4">
                                {astronotes?.keywords
                                    .split(',')
                                    .map((value) => (
                                        <AstronotesKeyword
                                            keyword={value}
                                            key={value}
                                        />
                                    ))}
                            </div>
                        )
                    ) : (
                        <div className="flex justify-center md:justify-start flex-wrap gap-2.5 pt-3 lg:pt-4">
                            <Skeleton
                                repeat={4}
                                isCustomSize
                                className="w-16 h-6 rounded-full"
                            />
                        </div>
                    )}
                    <StartReadingButton
                        first_problem_id={astronotes?.first_problem_id}
                    />
                </div>
            </div>

            {astronotes?.description && (
                <p className="text-xs text-justify lg:text-sm">
                    {astronotes.description}
                </p>
            )}

            <div
                id="contents"
                className="flex flex-col gap-2 scroll-mt-32 md:gap-3">
                <span className="text-sm font-bold font-body lg:text-base">
                    Daftar Isi
                </span>
                {astronotes ? (
                    <Accordion
                        item={astronotes.chapters.map((value) => ({
                            title: value.title,
                            jsxContent: (
                                <ChapterContent
                                    id={value.id}
                                    slug={slug ?? serverSlug}
                                    category={astronotes.category}
                                />
                            ),
                            onClick: () => {
                                tracker?.genericTrack(
                                    'Click Book Chapter Accordion',
                                    {
                                        'Book Slug': slug,
                                        'Chapter Name': value.title
                                    }
                                );
                            }
                        }))}
                    />
                ) : (
                    <div className="p-4 space-y-4">
                        <Skeleton repeat={4} isCustomSize className="h-12" />
                    </div>
                )}
            </div>
        </div>
    );
};

const Tabs = (): JSX.Element => {
    const { asPath } = useRouter();

    const tabStyle = (tabKey: 'details' | 'contents'): string =>
        cn(
            'text-center text-sm py-3 border-b-2 flex-1 md:flex-none first:!px-1 whitespace-nowrap',
            (!asPath.includes('#') && tabKey == 'details') ||
                asPath.includes(tabKey)
                ? TabStyle.activeNeutral
                : TabStyle.default
        );

    return (
        <div className="sticky z-10 flex items-end w-full pb-2 overflow-x-auto bg-black top-14 no-scrollbar">
            <Link className={tabStyle('details')} href="#details" replace>
                Detail
            </Link>
            <Link className={tabStyle('contents')} href="#contents" replace>
                Daftar Isi
            </Link>
            <div
                className={cn(
                    'border-b-2 hidden md:block md:grow',
                    TabStyle.default
                )}></div>
        </div>
    );
};

const Breadcrumbs = ({ title }: { title?: string }): JSX.Element => {
    return (
        <div className="flex flex-row gap-2.5 items-center text-xs md:text-sm py-4">
            <Link href={'/astronotes'} className="cursor-pointer">
                <h3 className="text-[#666666] hover:text-[#666666]/[0.75] duration-100 transition-all ease-in-out">
                    Perpustakaan
                </h3>
            </Link>
            <FaChevronRight className="text-[#666666] h-3 md:h-3.5" />
            {title ? (
                <h1 className="text-white">{title}</h1>
            ) : (
                <Skeleton isCustomSize className="w-24 h-4" />
            )}
        </div>
    );
};

const StartReadingButton = ({
    first_problem_id
}: Pick<BookDetailInterface, 'first_problem_id'>): JSX.Element => {
    const router = useRouter();
    const { slug } = router.query as { slug: string };
    const buttonRef = useRef<HTMLDivElement | null>(null);
    const onScreen = useOnScreen(buttonRef, '-128px 0px 0px 0px');

    const isAuthenticated = useSelector(getIsAuthenticated);
    const getLink = (): string => {
        if (!first_problem_id) return '?';
        if (!isAuthenticated) return '/daftar';
        if (!!first_problem_id)
            return `/astronotes/textbook/${slug}/${first_problem_id}`;
        return `/astronotes/${slug}/1`;
    };

    return (
        <>
            <div ref={buttonRef} className="w-full">
                <Button
                    href={getLink()}
                    variant="primary"
                    disabled={!first_problem_id}
                    className={cn(
                        !first_problem_id && 'btn-disabled',
                        'w-full my-2 text-center md:w-max'
                    )}>
                    Mulai Membaca
                </Button>
            </div>
            <Button
                href={getLink()}
                variant="primary"
                disabled={!first_problem_id}
                className={cn(
                    'transition fixed inset-x-4 md:hidden bottom-8 text-center',
                    !first_problem_id && 'btn-disabled',
                    !onScreen
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                )}>
                Mulai Membaca
            </Button>
        </>
    );
};

export default AstronotesDetail;
