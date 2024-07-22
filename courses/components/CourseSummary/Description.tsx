import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Skeleton from 'commons/components/elements/Skeleton';
import useOnScreen from 'commons/hooks/useOnScreen';
import { useGetCourseDetailQuery } from 'courses/redux/api/courseApi';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useGetSubchapterDetailV2Query } from 'courses/redux/api/privateCourseV2Api';
import { useGetPublicSubchapterDetailV2Query } from 'courses/redux/api/publicCourseV2Api';

const Description = ({ ssrSubchapter }: { ssrSubchapter: SubChapter }): JSX.Element => {
    const router = useRouter();
    const { id, slug } = router.query;
    const anchor = useRef<HTMLDivElement>({} as HTMLDivElement);
    const isOnScreen = useOnScreen(anchor);
    const isAuthenticated = useSelector(getIsAuthenticated);

    const { data: courseDetail } = useGetCourseDetailQuery(
        { slug: id as string },
        { skip: !id }
    );

    const privateSubchapterDetails = useGetSubchapterDetailV2Query(
        { course_slug: id as string, subchapter_slug: slug as string },
        { skip: !id || !slug || !isAuthenticated }
    );
    const publicSubchapterDetails = useGetPublicSubchapterDetailV2Query(
        { course_slug: id as string, subchapter_slug: slug as string },
        { skip: !id || !slug }
    );
    const { data: subchapterDetail, isLoading } = isAuthenticated
        ? privateSubchapterDetails
        : publicSubchapterDetails;
    const subchapter = subchapterDetail ?? ssrSubchapter;

    return (
        <div className="flex flex-col lg:flex-row justify-between gap-4 lg:gap-[150px] px-5 md:px-16">
            <article>
                {isLoading && <Skeleton className="!w-[200px] !h-[20px]" />}
                <p className="text-xs font-body md:text-base">
                    {subchapter?.video?.description !== '-' ? (
                        <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            linkTarget={'_blank'}>
                            {
                                subchapter?.video?.description?.replaceAll(
                                    '\n',
                                    '\n\n'
                                ) as string
                            }
                        </ReactMarkdown>
                    ) : (
                        '-'
                    )}
                </p>
            </article>
            <div className="bg-[#FFFFFF08] rounded-[10px]">
                <div className="lg:min-w-[360px] flex justify-center gap-8 sm:gap-10 px-6 py-5 border-b border-[#2D2D2D]">
                    <div className="flex flex-col gap-[10px] justify-end items-center">
                        <div className="w-[36px] h-[32px] flex items-end gap-[6px]">
                            <div
                                className={`w-[8px] h-[40%] rounded-[100px] bg-accent-purple`}></div>
                            <div
                                className={`w-[8px] h-[70%] rounded-[100px] ${
                                    courseDetail?.course_detail.level ===
                                    'BEGINNER'
                                        ? 'bg-white'
                                        : 'bg-accent-purple'
                                }`}></div>
                            <div
                                className={`w-[8px] h-[100%] rounded-[100px] ${
                                    courseDetail?.course_detail.level ===
                                    'EXPERT'
                                        ? 'bg-accent-purple'
                                        : 'bg-white'
                                }`}></div>
                        </div>
                        <span className="inline-block font-body text-[#CCCCCC] text-xs md:text-base whitespace-nowrap">
                            Level
                            {courseDetail?.course_detail.level === 'BEGINNER' &&
                                ' pemula'}
                            {courseDetail?.course_detail.level ===
                                'INTERMEDIATE' && ' menengah'}
                            {courseDetail?.course_detail.level === 'EXPERT' &&
                                ' akhir'}
                        </span>
                    </div>
                    {courseDetail?.course_detail.rating ? (
                        <div className="flex flex-col gap-[10px] items-center">
                            <span className="inline-block font-body font-bold text-[22px] md:text-[28px]">
                                {courseDetail?.course_detail.rating.toFixed(1)}
                            </span>
                            <span className="inline-block font-body text-[#CCCCCC] text-xs md:text-base">
                                Nilai
                            </span>
                        </div>
                    ) : (
                        <></>
                    )}
                    {courseDetail?.course_detail.total_books ? (
                        <div className="flex flex-col gap-[10px] items-center">
                            <span className="inline-block font-body font-bold text-[22px] md:text-[28px]">
                                {courseDetail?.course_detail.total_books}
                            </span>
                            <span className="inline-block font-body text-[#CCCCCC] text-xs md:text-base">
                                AstroNotes
                            </span>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                <div className="relative flex flex-col gap-3 p-5 pb-0">
                    {!isOnScreen && (
                        <div className="w-full h-[40px] absolute left-0 bottom-[-1px] bg-gradient-to-b from-transparent to-[#121212] z-[1]"></div>
                    )}
                    <h2 className="text-xs uppercase font-body text-neutral-600 md:text-base">
                        Pengajar
                    </h2>
                    <div className="flex flex-col gap-3 max-h-[200px] overflow-hidden">
                        <div className="flex flex-col gap-3 overflow-y-auto">
                            {courseDetail?.course_detail.lecturers?.map(
                                (value) => (
                                    <div
                                        key={value.photo}
                                        className="flex items-center gap-3">
                                        <Image
                                            src={value.photo}
                                            width={48}
                                            height={48}
                                            className="object-cover rounded-full"
                                        />
                                        <div className="flex flex-col gap-1">
                                            <h3 className="font-body text-[#CCCCCC] text-xs md:text-base">
                                                {value.name}
                                            </h3>
                                            <span className="inline-block text-xs font-extrabold md:text-base">
                                                {value.role}
                                            </span>
                                        </div>
                                    </div>
                                )
                            )}
                            <div ref={anchor}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Description;
