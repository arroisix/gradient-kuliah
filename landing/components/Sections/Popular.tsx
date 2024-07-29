import Link from 'next/link';
import Container from './Container';
import { useTracker } from 'tracker/tracker';
import { cn, onlyText } from 'commons/utils';
import Skeleton from 'commons/components/elements/Skeleton';
import { useRef } from 'react';
import { MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md';
import { useGrid } from 'courses/contexts/GridProvider';
import ProductCard from 'commons/components/elements/ProductCard';
import { getBookBaseHref } from 'courses/utils';

const Popular = ({
    type,
    majorData,
    classes,
    popularBooks,
    setSelectedMajor,
    isLoading
}: LandingPopularProps): JSX.Element => {
    const tracker = useTracker();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { cellWidth, gapWidth } = useGrid();

    const scrollTo = (direction: 'left' | 'right') => {
        const scrollWidth = cellWidth! + gapWidth!;
        const scrollAmount =
            direction === 'left' ? -scrollWidth! : scrollWidth!;
        scrollContainerRef.current?.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    };

    const isScrollable =
        type === 'book'
            ? (popularBooks?.length ?? 0) > 5
            : (classes?.length ?? 0) > 4;

    return (
        <Container
            className="flex flex-col items-center gap-6 py-9 md:py-16"
            id={`${type}s-recommendation`}>
            <div
                className={cn(
                    'flex flex-col w-full md:flex-row',
                    isScrollable && 'md:justify-between',
                    !isScrollable && 'md:justify-center',
                    'md:items-center'
                )}>
                <div className="flex flex-col items-center gap-3 md:flex-row md:gap-6">
                    <h2 className="font-sans text-xl font-extrabold text-center md:text-left">
                        {type === 'book'
                            ? 'Bacaan Terpopuler di Perpustakaan'
                            : 'Kelas Terpopuler'}
                    </h2>
                    <select
                        name={`${type}-major-recommendation`}
                        id={`${type}-major-recommendation-select`}
                        onChange={(e) => setSelectedMajor(e.target.value)}
                        className="w-full  md:w-[320px] bg-[#141414] text-sm md:text-base rounded-lg border border-[#333333] shadow-[0_4px_5px_0_rgba(0,0,0,0.502)] cursor-pointer">
                        {majorData?.map(({ slug, label }) => (
                            <option key={slug} value={slug}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
                {isScrollable && (
                    <div className="hidden gap-4 text-black md:flex">
                        <button
                            className="bg-white hover:bg-[#F8F8F8] duration-200 w-8 h-8 rounded-full flex justify-center items-center text-2xl"
                            onClick={() => scrollTo('left')}>
                            <MdOutlineChevronLeft size={24} />
                        </button>
                        <button
                            className="bg-white hover:bg-[#F8F8F8] duration-200 w-8 h-8 rounded-full flex justify-center items-center text-2xl"
                            onClick={() => scrollTo('right')}>
                            <MdOutlineChevronRight size={24} />
                        </button>
                    </div>
                )}
            </div>
            <div
                ref={scrollContainerRef}
                className={cn(
                    'w-full flex flex-1 gap-5 xl:gap-6 overflow-x-auto no-scrollbar',
                    isScrollable ? 'lg:justify-start' : 'lg:justify-center'
                )}>
                {isLoading ? (
                    <div className="flex w-full gap-5 xl:gap-8 lg:grid lg:grid-cols-4 carousel carousel-center">
                        <Skeleton
                            repeat={4}
                            className="w-[150px] lg:w-full h-60 carousel-item flex-none lg:!px-0 !mb-0 !py-0"
                        />
                    </div>
                ) : (
                    <>
                        {type === 'book'
                            ? popularBooks?.map(
                                  ({
                                      id,
                                      title,
                                      slug,
                                      book_cover_url: thumbnail,
                                      category_name: category
                                  }) => (
                                      <div
                                          key={id}
                                          className="min-w-[57%] md:min-w-[30%] lg:min-w-[18%] max-w-[57%] md:max-w-[30%] lg:max-w-[18%]">
                                          <ProductCard
                                              orientation="vertical"
                                              category={category}
                                              heading="h3"
                                              href={`${getBookBaseHref(
                                                  category
                                              )}/${slug}`}
                                              product={{
                                                  title,
                                                  thumbnail,
                                                  inProgress: false,
                                                  latestProgress: 0
                                              }}
                                              className="h-full"
                                              eventName='User click Class Items on "Bacaan Terpopuler di Perpustakaan" Section'
                                              eventPayload={{ Title: title }}
                                          />
                                      </div>
                                  )
                              )
                            : classes?.map(
                                  ({
                                      id,
                                      thumbnail,
                                      course_name: title,
                                      slug
                                  }) => (
                                      <div
                                          key={id}
                                          className="min-w-[57%] md:min-w-[30%] lg:min-w-[23%] max-w-[57%] md:max-w-[30%] lg:max-w-[23%]">
                                          <ProductCard
                                              orientation="vertical"
                                              category="kelas"
                                              href={`/kelas/${slug}`}
                                              heading="h3"
                                              product={{
                                                  title,
                                                  thumbnail,
                                                  inProgress: false,
                                                  latestProgress: 0
                                              }}
                                              className="h-full"
                                              eventName='User click Class Items on "Kelas Terpopuler" Section'
                                              eventPayload={{
                                                  Course: title
                                              }}
                                          />
                                      </div>
                                  )
                              )}
                    </>
                )}
            </div>
            <Link
                href={type === 'book' ? '/perpustakaan' : '/kelas'}
                onClick={() => {
                    const sectionType =
                        type.charAt(0).toUpperCase() + type.slice(1);
                    tracker?.trackButtonClick(
                        `Click "Lihat Semua" ${sectionType} Button`,
                        onlyText('Lihat Semua'),
                        { 'Section Name': `${sectionType} Recommendation` }
                    );
                }}
                className="w-fit bg-white font-bold rounded-[70px] text-black px-6 py-2 text-sm md:text-base">
                Lihat Semua
            </Link>
        </Container>
    );
};

export default Popular;
