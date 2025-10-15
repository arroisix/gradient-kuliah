import { LearningProvider } from 'courses/contexts/LearningProvider';
import VideoLearnContainer from 'courses/containers/learn/video';
import LearnLayout from 'commons/learnLayout';
import withAnon from 'commons/withAnon';
import { GetStaticPaths, GetStaticPropsResult } from 'next';
import axios from 'axios';
import config from 'redux/api/config';
import { VideoJsonLd } from 'next-seo';
import moment from 'moment';

interface BelajarPageProps {
    subchapter: SubChapter;
    course: CourseDetail;
    description: string;
    recommendations: GetVideoRecommendationResponse;
}

const Belajar = ({
    subchapter,
    course,
    description,
    recommendations
}: BelajarPageProps): JSX.Element => {
    return (
        <>
            <LearningProvider>
                <LearnLayout noPadding showSubscriptionReminder>
                    <VideoLearnContainer
                        subchapter={subchapter}
                        course={course}
                        recommendations={recommendations}
                    />
                </LearnLayout>
            </LearningProvider>

            <VideoJsonLd
                name={subchapter?.subchapter_name}
                description={description}
                learningResourceType="Concept Overview"
                contentUrl={subchapter?.video?.video_url}
                thumbnailUrls={[subchapter?.video?.thumbnail]}
                uploadDate={moment(new Date(subchapter?.created_at)).format(
                    'YYYY-MM-DD'
                )}
            />
        </>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: true
    };
};

export const getStaticProps = async ({
    params
}: {
    params: { id: string; slug: string };
}): Promise<
    GetStaticPropsResult<
        BelajarPageProps & {
            title: string;
            description: string;
            canonical: string;
            openGraph: { [key: string]: unknown };
        }
    >
> => {
    const { id, slug } = params;

    try {
        const [subchapterResponse, courseResponse, recommendationResponse] =
            await Promise.all([
                axios.get<SubChapter>(
                    `${config.API_BASE_URL}courses/v2/public/${id}/subchapter/${slug}/`
                ),
                axios.get<CourseDetailResponse>(
                    `${config.API_BASE_URL}courses/${id}`
                ),
                axios.get<GetVideoRecommendationResponse>(
                    `${config.API_BASE_URL}learning-experiences/recommendations/videos/${slug}/`
                )
            ]);

        const subchapter = subchapterResponse.data;
        const course = courseResponse.data.course_detail;
        const recommendations = recommendationResponse.data;

        if (!subchapter) {
            // resource not found -> show 404
            return { notFound: true };
        }

        const META_TITLE = `Materi ${course.course_name}: ${subchapter.subchapter_name}`;
        const META_DESCRIPTION = `Video pembelajaran ${subchapter.subchapter_name}. Tingkatkan pemahaman kamu dengan materi berkualitas tinggi dari para ahli.`;

        return {
            props: {
                subchapter,
                course,
                recommendations,
                canonical: `https://gradient.academy/kelas/${id}/${slug}`,
                title: META_TITLE,
                description: META_DESCRIPTION,
                openGraph: {
                    type: 'video.other',
                    title: META_TITLE,
                    description: META_DESCRIPTION,
                    url: `https://gradient.academy/kelas/${id}/${slug}`,
                    video: subchapter.video?.video_url,
                    image: subchapter.thumbnail
                }
            },
            // normal ISR interval
            revalidate: 60 * 60
        };
    } catch (err: any) {
        console.error('getStaticProps error for', { id, slug }, err);

        // If the API returned 404-like status, surface as notFound
        const status = err?.response?.status;
        if (status === 404) {
            return {
                redirect: {
                    destination: '/404',
                    permanent: true
                }
            };
        }

        // Transient error (network, 5xx, timeouts) -> return a safe fallback props
        // and a short revalidate so ISR retries soon
        return {
            props: {
                // minimal props the page expects — be explicit in the page component
                subchapter: null as any,
                course: null as any,
                recommendations: null as any,
                // you can pass an error flag/message to the page
                __errorMessage: 'Could not load data, please try again later'
            } as any,
            revalidate: 30 // retry in 30s
        };
    }
};

Belajar.displayName = 'Watch Video';
export default withAnon(Belajar);
