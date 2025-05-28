import Button from 'commons/components/elements/Button';
import SubscribeButton from '../LandingPage/Common/SubscribeButton';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useSelector } from 'react-redux';
import { PercentageProgess } from './LearningProgress/PercentageProgress';
import ShareContentButton from '../ShareContentButton';
import RatingButton from '../CourseRatingButton';
import Link from 'next/link';
import Image from 'next/image';
import { CDN_URL } from 'commons/constants';

const CourseDescription = ({
    slug,
    course
}: Pick<GradientBaseComponentWithSlug, 'slug'> & {
    course: CourseLandingPageData;
}): JSX.Element => {
    const {
        is_subscribed,
        latest_watch_video,
        isLoading,
        first_video_in_course
    } = useCourseSubscription(slug);
    const isAuthenticated = useSelector(getIsAuthenticated);

    return (
        <div className="w-screen px-5 lg:w-3/12">
            <div className="flex flex-col gap-4 p-4 bg-zinc-900 rounded-xl">
                <h2 className="font-semibold text-gray-500">
                    Tentang Kelas {course?.course_name}
                </h2>
                <div className="w-full h-px bg-gray-500" />
                <div className="text-sm">{course?.description}</div>
                {course?.tags?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 font-semibold text-xs">
                        {course?.tags.map((tag) => {
                            const t = tag as Tag;
                            return (
                                <Link
                                    href={`/search/results/${t.name}`}
                                    target="_blank"
                                    key={`tag-${t.name}`}
                                    className="px-2 h-6 rounded-full border flex justify-center items-center">
                                    {t.name}
                                </Link>
                            );
                        })}
                    </div>
                )}
                <div className="flex gap-3 w-full">
                    <RatingButton />
                    <ShareContentButton
                        typeCopy="COURSE"
                        shareCopy={`Coba deh cek Kelas ${course?.course_name} di Gradient Academy!`}
                    />
                </div>
                <Link
                    href={`/downloads?search=${encodeURIComponent(
                        course?.course_name || ''
                    )}`}
                    className="flex items-center justify-between w-full py-3 px-4 bg-[#2C2C2C] rounded-full text-white text-sm font-semibold group relative overflow-hidden">
                    <span className="mr-2">Lihat Hasil Download Kamu</span>
                    <div className="absolute right-2">
                        <Image
                            src={`${CDN_URL}/assets/video-downloads-folder.png`}
                            alt="Download Folder"
                            width={86}
                            height={56}
                        />
                    </div>
                </Link>
                <h2 className="text-sm text-gray-500 uppercase">Pengajar</h2>
                <div className="flex flex-col gap-2">
                    {course?.lecturers.map((lecturer: Lecturer) => (
                        <div
                            className="flex items-center gap-2"
                            key={lecturer.name}>
                            <div>
                                <div className="flex items-center justify-center overflow-hidden rounded-full h-11 w-11 bg-neutral-200">
                                    <img
                                        src={lecturer.photo}
                                        className="object-contain object-bottom w-full"
                                        alt="lecturer"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col text-sm">
                                <h3>{lecturer.name}</h3>
                                <p className="font-semibold">{lecturer.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    {isAuthenticated &&
                        is_subscribed &&
                        latest_watch_video?.subchapter.subchapter_name && (
                            <PercentageProgess slug={slug} />
                        )}
                    {is_subscribed && !isLoading ? (
                        latest_watch_video?.subchapter.subchapter_name ? (
                            <Button
                                className="w-full text-center"
                                variant="primary"
                                href={`/kelas/${slug}/${latest_watch_video?.subchapter.subchapter_slug}`}
                                eventName="Continue Learning Button on Course Landing Page"
                                eventPayload={{
                                    Position: 'HERO',
                                    'Course Slug': slug
                                }}>
                                Lanjut Belajar
                            </Button>
                        ) : (
                            <Button
                                className="w-full text-center"
                                variant="primary"
                                href={`/kelas/${slug}/${first_video_in_course?.subchapter_slug}`}
                                eventName="Start Learning Button on Course Landing Page"
                                eventPayload={{
                                    Position: 'RIGHT_SIDE',
                                    'Course Slug': slug
                                }}>
                                Mulai Belajar
                            </Button>
                        )
                    ) : (
                        <SubscribeButton slug={slug} className="w-full" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseDescription;
