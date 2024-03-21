import Image from 'next/image';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';
import { GrStar } from 'react-icons/gr';
import { useTracker } from 'tracker/tracker';
import AstronotesKeyword from 'courses/components/LearningExperience/AstroNotes/Detail/AstronotesKeyword';
import Accordion from 'commons/components/elements/Accordion';
import ChapterContent from 'courses/components/LearningExperience/AstroNotes/Detail/ChapterContent';

const AstronotesDetail = ({
    slug,
    astronotes
}: {
    slug: string;
    astronotes?: BookDetailInterface;
}): JSX.Element => {
    const tracker = useTracker();

    return (
        <div className="mx-auto w-full lg:w-[75%] xl:w-[60%] flex flex-col">
            <div className="flex flex-row gap-2.5 items-center pb-7 text-xs md:text-sm">
                <Link href={'/astronotes'} className="cursor-pointer">
                    <h3 className="text-[#666666] hover:text-[#666666]/[0.75] duration-100 transition-all ease-in-out">
                        Perpustakaan
                    </h3>
                </Link>
                <FaChevronRight className="text-[#666666] h-3 md:h-3.5" />
                <h1 className="text-white">{astronotes?.title}</h1>
            </div>

            <div className="flex flex-row gap-4 pb-4 md:gap-6 lg:gap-8 md:pb-6">
                <div className="aspect-[256/364] relative min-w-[100px] md:min-w-[150px] max-w-[132px] md:max-w-[164px] h-auto w-[50%] border rounded border-neutral-700">
                    <Image
                        src={
                            astronotes?.cover_url ||
                            'https://assets.gradient.academy/assets/astronotes-kalkulus2-placeholder.jpg'
                        }
                        layout="fill"
                        className="rounded"
                    />
                </div>
                <div className="flex flex-col gap-4">
                    <h1 className="text-base font-extrabold text-white md:text-lg lg:text-xl">
                        {astronotes?.title}
                    </h1>

                    <div className="flex flex-col gap-2 text-sm lg:text-base">
                        {astronotes?.category === 'Textbook' ? (
                            <>
                                <h2 className="font-sans">
                                    {astronotes?.authors.join(', ')}
                                </h2>
                                {astronotes?.isbn && (
                                    <h2 className="font-sans text-[#999999]">{`ISBN: ${astronotes?.isbn}`}</h2>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center gap-1">
                                <GrStar className="text-[#999999] w-4 lg:w-5 h-4 lg:h-5" />

                                <span className="font-sans text-[#999999]">
                                    {`${astronotes?.rating.toFixed(1)} dari ${
                                        (astronotes?.feedback_total ?? 0) >
                                        10000
                                            ? '10000+'
                                            : astronotes?.feedback_total
                                    } penilaian`}
                                </span>
                            </div>
                        )}
                    </div>

                    {astronotes?.keywords && (
                        <div className="hidden md:flex flex-wrap gap-2.5 pt-3 lg:pt-4">
                            {astronotes?.keywords.split(',').map((value) => (
                                <AstronotesKeyword
                                    keyword={value}
                                    key={value}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {astronotes?.keywords && (
                <div className="flex flex-wrap gap-2.5 pb-6 md:hidden">
                    {astronotes?.keywords.split(',').map((value) => (
                        <AstronotesKeyword keyword={value} key={value} />
                    ))}
                </div>
            )}

            {!!astronotes && (
                <Accordion
                    item={astronotes.chapters.map((value) => ({
                        title: value.title,
                        jsxContent: (
                            <ChapterContent
                                id={value.id}
                                slug={slug as string}
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
            )}
        </div>
    );
};

export default AstronotesDetail;
