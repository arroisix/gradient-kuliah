import Link from 'next/link';
import Container from './Container';
import DashboardCard from 'dashboard/components/DashboardCard';
import { useTracker } from 'tracker/tracker';
import { onlyText } from 'commons/utils';
import Skeleton from 'commons/components/elements/Skeleton';

const Popular = ({
    type,
    majorData,
    classes,
    popularBooks,
    setSelectedMajor,
    isLoading
}: LandingPopularProps): JSX.Element => {
    const tracker = useTracker();

    return (
        <Container
            className="flex flex-col gap-6 py-9 md:py-16 items-center"
            id={`${type}s-recommendation`}>
            <div className=" flex flex-col gap-3 items-center">
                <h2 className="font-sans text-xl font-extrabold text-center">
                    {type === 'book'
                        ? 'Bacaan Terpopuler di Perpustakaan'
                        : 'Kelas Terpopuler'}
                </h2>
                <select
                    name={`${type}-major-recommendation`}
                    id={`${type}-major-recommendation-select`}
                    onChange={(e) => setSelectedMajor(e.target.value)}
                    className="w-[250px] md:w-[350px] lg:w-[400px] bg-[#141414] text-sm md:text-base rounded-lg border border-[#333333] shadow-[0_4px_5px_0_rgba(0,0,0,0.502)] cursor-pointer">
                    {majorData?.map(({ slug, label }) => (
                        <option key={slug} value={slug}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>
            {isLoading ? (
                <div className="w-full flex gap-5 xl:gap-8 lg:grid lg:grid-cols-4 carousel carousel-center">
                    <Skeleton
                        repeat={4}
                        className="w-[150px] lg:w-full h-60 carousel-item flex-none lg:!px-0 !mb-0 !py-0"
                    />
                </div>
            ) : (
                <div className="w-full flex flex-1 gap-5 xl:gap-6 overflow-x-auto no-scrollbar lg:justify-center">
                    {type === 'book'
                        ? popularBooks?.map(
                              ({
                                  id,
                                  title,
                                  slug,
                                  book_cover_url,
                                  category_name
                              }) => (
                                  <div
                                      key={id}
                                      className="min-w-[57%] md:min-w-[30%] lg:min-w-[18%] max-w-[57%] md:max-w-[30%] lg:max-w-[18%]">
                                      <DashboardCard
                                          id={id}
                                          type={category_name}
                                          thumbnail={book_cover_url}
                                          title={title}
                                          in_progress={false}
                                          course_slug={slug}
                                          chapter_id=""
                                          subchapter_id=""
                                          book_slug=""
                                          latest_page={0}
                                          eventName='User click Class Items on "Bacaan Terpopuler di Perpustakaan" Section'
                                          eventPayload={{ Title: title }}
                                      />
                                  </div>
                              )
                          )
                        : classes?.map(
                              ({ id, thumbnail, course_name, slug }) => (
                                  <div
                                      key={id}
                                      className="min-w-[57%] md:min-w-[30%] lg:min-w-[23%] max-w-[57%] md:max-w-[30%] lg:max-w-[23%]">
                                      <DashboardCard
                                          id={id}
                                          type="Video"
                                          thumbnail={thumbnail}
                                          title={course_name}
                                          in_progress={false}
                                          course_slug={slug}
                                          chapter_id=""
                                          subchapter_id=""
                                          book_slug=""
                                          latest_page={0}
                                          eventName='User click Class Items on "Kelas Terpopuler" Section'
                                          eventPayload={{ Course: course_name }}
                                      />
                                  </div>
                              )
                          )}
                </div>
            )}
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
