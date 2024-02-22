import { useRouter } from 'next/router';
import Link from 'next/link';
import { useGetPublicTableContentSubchaptersQuery } from 'courses/redux/api/astronotesApi';
import { useTracker } from 'tracker/tracker';
import Skeleton from 'commons/components/elements/Skeleton';
import { Dispatch, useState, SetStateAction } from 'react';

const ChapterContent = ({
    id,
    slug
}: GradientBaseComponentWithId & { slug: string }): JSX.Element => {
    const { data: subchapters, isLoading } =
        useGetPublicTableContentSubchaptersQuery({
            slug: slug,
            chapter_id: id
        });
    const [subchapterSections, setSubchapterSections] = useState<
        BookSubchapterSection[]
    >([]);
    const tracker = useTracker();

    return (
        <div className="flex flex-col gap-2">
            {isLoading ? (
                <>
                    <Skeleton className="h-[40px] md:h-[50px]" />
                    <Skeleton className="h-[40px] md:h-[50px]" />
                    <Skeleton className="h-[40px] md:h-[50px]" />
                    <Skeleton className="h-[40px] md:h-[50px]" />
                </>
            ) : (subchapters?.data?.length ?? 0) == 0 ? (
                <p>Sabar ya, materi ini akan segera hadir untukmu.</p>
            ) : (
                <div className="flex flex-row">
                    <div className="flex flex-col w-full max-h-[250px] overflow-y-auto pr-3 md:pr-7">
                        {subchapters?.data?.map(
                            (subchapter: BookSubchapter) => (
                                <SubchapterButton
                                    slug={slug}
                                    id={id}
                                    subchapter={subchapter}
                                    setSubchapterSections={
                                        setSubchapterSections
                                    }
                                    key={subchapter.id}
                                />
                            )
                        )}
                    </div>

                    <div
                        className={`w-[60%] ${
                            subchapterSections.length === 0 && 'hidden'
                        } flex flex-col max-h-[250px] overflow-y-auto px-3 md:px-7`}>
                        {subchapterSections.map(
                            (subchapterSection: BookSubchapterSection) => (
                                <Link
                                    key={subchapterSection.id}
                                    href={`/astronotes/${slug}/${subchapterSection.page_order}#${subchapterSection.id}`}
                                    onClick={() => {
                                        tracker?.genericTrack(
                                            'Click Subchapter Section Book Item',
                                            {
                                                'Book Slug': slug,
                                                'Chapter Name': id,
                                                'Subchapter Section Name':
                                                    subchapterSection.title
                                            }
                                        );
                                    }}>
                                    <button className="w-full text-sm md:text-base text-left p-4 rounded-lg hover:bg-[#5F2BCE40]/[0.25] font-sans hover:font-bold hover:text-white">
                                        {subchapterSection.title}
                                    </button>
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
    setSubchapterSections: Dispatch<SetStateAction<BookSubchapterSection[]>>;
};

const SubchapterButton = ({
    slug,
    id,
    subchapter,
    setSubchapterSections
}: SubchapterButtonProps): JSX.Element => {
    const router = useRouter();
    const tracker = useTracker();

    const handleSubchapterButton = () => {
        if (subchapter.sections.length > 0) {
            setSubchapterSections(subchapter.sections);
        } else {
            setSubchapterSections([]);
            tracker?.genericTrack('Click Subchapter Book Item', {
                'Book Slug': slug,
                'Chapter Name': id,
                'Subchapter Name': subchapter.title
            });
            router.push(
                `/astronotes/${slug}/${subchapter.page_order}#${subchapter.id}`
            );
        }
    };

    return (
        <button
            onClick={handleSubchapterButton}
            className="w-full text-sm md:text-base text-left p-4 rounded-lg hover:bg-[#5F2BCE40]/[0.25] font-sans hover:font-bold hover:text-white">
            {subchapter.title}
        </button>
    );
};

export default ChapterContent;
