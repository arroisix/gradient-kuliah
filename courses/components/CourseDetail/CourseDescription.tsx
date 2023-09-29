import Button from 'commons/components/elements/Button';
import { useGetLandingCourseDataQuery } from 'courses/redux/api/publicCourseApi';
import SubscribeButton from '../LandingPage/Common/SubscribeButton';
import { PercentageProgess } from './LearningProgress';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useSelector } from 'react-redux';

const CourseDescription = ({
    slug
}: GradientBaseComponentWithSlug): JSX.Element => {
    const { data } = useGetLandingCourseDataQuery(slug);
    const {
        is_subscribed,
        latest_watch_video,
        isLoading,
        first_video_in_course
    } = useCourseSubscription(slug);
    const isAuthenticated = useSelector(getIsAuthenticated);

    return (
        <div className="px-5 w-screen lg:w-3/12">
            <div className="bg-zinc-900 p-4 rounded-xl flex flex-col gap-2">
                <h1 className="font-semibold text-gray-500">
                    Tentang Kelas Ini
                </h1>
                <div className="h-px bg-gray-500 w-full" />
                <div className="text-sm">{data?.description}</div>

                <div className="text-sm text-gray-500">PENGAJAR</div>
                <div className="flex flex-col gap-2">
                    {data?.lecturers.map((lecturer: Lecturer) => (
                        <div
                            className="flex gap-2 items-center"
                            key={lecturer.name}>
                            <div>
                                <div className="h-11 w-11 bg-neutral-200 rounded-full overflow-hidden flex justify-center items-center">
                                    <img
                                        src={lecturer.photo}
                                        className="object-contain object-bottom w-full"
                                        alt="lecturer"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col text-sm">
                                <p>{lecturer.name}</p>
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
                                href={`/kelas/${slug}/belajar/video/${latest_watch_video?.chapter_id}/${latest_watch_video?.subchapter.id}`}
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
                                href={`/kelas/${slug}/belajar/video/${first_video_in_course?.chapter_id}/${first_video_in_course?.subchapter_id}`}
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
