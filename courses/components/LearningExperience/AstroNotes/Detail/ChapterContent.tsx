import Link from 'next/link';
import { useGetPublicTableContentSubchaptersQuery } from 'courses/redux/api/astronotesApi';
import { useTracker } from 'tracker/tracker';
import Skeleton from 'commons/components/elements/Skeleton';
import { useState, useEffect } from 'react';
import { cn } from 'commons/utils';
import { useRouter } from 'next/router';

const ChapterContent = ({
    id,
    slug,
    category,
    isDrawer,
    activeSubchapter: activeSubchapter_
}: GradientBaseComponentWithId & {
    slug: string;
    category: Astronote['category'];
    isDrawer?: boolean;
    activeSubchapter?: string;
}): JSX.Element => {
    const { data: subchapters, isLoading } =
        useGetPublicTableContentSubchaptersQuery({
            slug: slug,
            chapter_id: id
        });
    const [subchapterSections, setSubchapterSections] = useState<
        BookSubchapterSection[]
    >([]);
    const [activeSubchapter, setActiveSubchapter] = useState(activeSubchapter_);
    const router = useRouter();
    const { problemId } = router.query as { problemId?: string };
    const tracker = useTracker();

    useEffect(() => {
        if (activeSubchapter_) {
            const subchapter = subchapters?.data?.find(
                (sub) => sub.id == activeSubchapter_
            );
            setSubchapterSections(subchapter?.sections ?? []);
        }
    }, [activeSubchapter_]);

    return (
        <div className="flex flex-col gap-2">
            {isLoading ? (
                <Skeleton className="h-[40px] md:h-[50px] !mb-0" repeat={4} />
            ) : (subchapters?.data?.length ?? 0) == 0 ? (
                <p>Sabar ya, materi ini akan segera hadir untukmu.</p>
            ) : (
                <div
                    className={cn(
                        'flex flex-row',
                        isDrawer ? 'gap-2' : ' gap-x-3 md:gap-x-7'
                    )}>
                    <div className="flex flex-col w-full max-h-[250px] overflow-y-auto ">
                        {subchapters?.data?.map(
                            (subchapter: BookSubchapter) => (
                                <SubchapterButton
                                    slug={slug}
                                    id={id}
                                    subchapter={subchapter}
                                    category={category ?? ''}
                                    onSelectSubchapter={(
                                        sections,
                                        subchapterId
                                    ) => {
                                        setSubchapterSections(sections);
                                        setActiveSubchapter(subchapterId);
                                    }}
                                    activeSubchapter={activeSubchapter}
                                    key={subchapter.id}
                                    isDrawer={isDrawer}
                                />
                            )
                        )}
                    </div>

                    <div
                        className={cn(
                            'w-[60%] duration-100 transition-all ease-in-out flex flex-col max-h-[250px] overflow-y-auto',
                            !isDrawer && 'px-3 md:px-7',
                            subchapterSections.length === 0 && 'hidden'
                        )}>
                        {subchapterSections.map(
                            (subchapterSection: BookSubchapterSection) => (
                                <Link
                                    key={subchapterSection.id}
                                    href={
                                        category?.toLowerCase() === 'textbook'
                                            ? `/astronotes/textbook/${slug}/${subchapterSection.id}`
                                            : `/astronotes/${slug}/${subchapterSection.page_order}#${subchapterSection.id}`
                                    }
                                    onClick={() => {
                                        tracker?.genericTrack(
                                            'Click Book Subsection Item',
                                            {
                                                'Book Slug': slug,
                                                'Chapter Name': id,
                                                'Subchapter Section Name':
                                                    subchapterSection.title
                                            }
                                        );
                                    }}
                                    className={cn(
                                        'w-full text-left p-3 rounded-md hover:bg-[#5F2BCE40]/25 font-sans hover:font-bold hover:text-white duration-100 transition-all ease-in-out',
                                        problemId == subchapterSection.id &&
                                            'font-bold',
                                        isDrawer
                                            ? 'text-sm'
                                            : 'text-sm md:text-base'
                                    )}>
                                    {subchapterSection.title}
                                </Link>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

type SubchapterButtonProps = {
    slug: string;
    id: string;
    subchapter: BookSubchapter;
    category: string;
    onSelectSubchapter: (
        sections: BookSubchapterSection[],
        subchapterId: string
    ) => void;
    isDrawer?: boolean;
    activeSubchapter?: string;
};

const SubchapterButton = ({
    id,
    subchapter,
    category,
    onSelectSubchapter,
    isDrawer,
    activeSubchapter
}: SubchapterButtonProps): JSX.Element => {
    const tracker = useTracker();
    const router = useRouter();
    const { slug, problemId } = router.query as {
        slug: string;
        problemId?: string;
    };

    const handleSubchapterButton = (): void => {
        if (subchapter.sections.length > 0) {
            onSelectSubchapter(subchapter.sections, subchapter.id);
        } else {
            onSelectSubchapter([], '');
            tracker?.genericTrack(
                isDrawer
                    ? 'User Click Subchapter List of Content'
                    : 'Click Book Section Item',
                {
                    'Book Slug': slug,
                    'Chapter Name': id,
                    'Subchapter Name': subchapter.title
                }
            );
        }
    };

    const href =
        subchapter.sections.length == 0
            ? category?.toLowerCase() === 'textbook'
                ? `/astronotes/textbook/${slug}/${subchapter.id}`
                : `/astronotes/${slug}/${subchapter.page_order}#${subchapter.id}`
            : router.asPath;

    return (
        <Link
            href={href}
            replace={href == router.asPath}
            onClick={handleSubchapterButton}
            className={cn(
                'w-full text-left p-3 rounded-md hover:bg-[#5F2BCE40]/[0.25] font-sans hover:font-bold hover:text-white duration-100 transition-all ease-in-out',
                isDrawer ? 'text-sm' : 'text-sm md:text-base',
                problemId == subchapter.id ||
                    (activeSubchapter == subchapter.id && 'bg-[#333] font-bold')
            )}>
            {subchapter.title}
        </Link>
    );
};

export default ChapterContent;
