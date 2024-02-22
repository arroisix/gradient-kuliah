import Image from 'next/image';
import { useRouter } from 'next/router';
import { FaChevronRight } from 'react-icons/fa';
import { GrStar } from 'react-icons/gr';
import { useTracker } from 'tracker/tracker';
import AstronotesKeyword from 'courses/components/LearningExperience/AstroNotes/Detail/AstronotesKeyword';
import Accordion from 'commons/components/elements/Accordion';
import ChapterContent from 'courses/components/LearningExperience/AstroNotes/Detail/ChapterContent';
import { useGetBookDetailQuery } from 'courses/redux/api/astronotesApi';

const AstronotesDetail = (): JSX.Element => {
    const router = useRouter();
    const { slug } = router.query;
    const { data: astronotes } = useGetBookDetailQuery({ slug: slug as string })
    const tracker = useTracker();

    return (
        <div className="mx-auto w-full lg:w-[75%] xl:w-[60%] flex flex-col">
            <div className="flex flex-row gap-2.5 items-center pb-7 text-xs md:text-sm lg:text-base">
                <h3 className="text-[#666666] font-bold">Perpustakaan</h3>
                <FaChevronRight className="text-[#666666] h-3 md:h-3.5 lg:h-4" />
                <h1 className="text-white font-bold">{astronotes?.book?.title}</h1>
            </div>

            <div className="flex flex-row gap-4 md:gap-6 lg:gap-8 pb-4 md:pb-6">
                <div className="aspect-[256/364] relative min-w-[100px] md:min-w-[150px] max-w-[150px] md:max-w-[175px] w-[50%] border rounded border-neutral-700">
                    <Image
                        src={
                            astronotes?.book?.cover_url ||
                            'https://assets.gradient.academy/assets/astronotes-kalkulus2-placeholder.jpg'
                        }
                        layout="fill"
                        className="rounded"
                    />
                </div>
                <div className="flex flex-col gap-4 lg:gap-5">
                    <h1 className="text-white font-extrabold text-base md:text-lg lg:text-xl">
                        {astronotes?.book?.title}
                    </h1>

                    <div className="flex flex-col gap-2 text-sm lg:text-base">
                        {astronotes?.book?.category === 'Textbook' ? (
                            <>
                                <h2 className="font-sans">
                                    {astronotes.book.authors.join(', ')}
                                </h2>
                                {astronotes?.book?.isbn && (
                                    <h2 className="font-sans text-[#999999]">{`ISBN: ${astronotes.book.isbn}`}</h2>
                                )}
                            </>
                        ) : (
                            <div className="flex gap-1 items-center">
                                <GrStar className="text-[#999999] w-4 lg:w-5 h-4 lg:h-5" />

                                <span className="font-sans text-[#999999]">
                                    {`${astronotes?.book?.rating.toFixed(1)} dari ${
                                        (astronotes?.book?.feedback_total ?? 0) <= 10000
                                            ? astronotes?.book?.feedback_total
                                            : '10000+'
                                    } penilaian`}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="hidden md:flex flex-wrap gap-2.5 pt-3 lg:pt-4">
                        {astronotes?.book?.keywords?.split(',').map((value) => (
                            <AstronotesKeyword keyword={value} key={value} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2.5 pb-6 md:hidden">
                {astronotes?.book?.keywords?.split(',').map((value) => (
                    <AstronotesKeyword keyword={value} key={value} />
                ))}
            </div>
            
            {astronotes?.book?.chapters && (
                <Accordion
                    item={astronotes.book.chapters.map((value) => ({
                        title: value.title,
                        jsxContent: (
                            <ChapterContent id={value.id} slug={slug as string} />
                        ),
                        onClick: () => {
                            tracker?.genericTrack('Click Book Chapter Accordion', {
                                'Book Slug': slug,
                                'Chapter Name': value.title
                            });
                        }
                    }))}
                />
            )}
        </div>
    );
};

export default AstronotesDetail;
