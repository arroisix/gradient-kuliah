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
        revalidate: 60 * 60 // Re-generate page every hour
    };
};

Belajar.displayName = 'Watch Video';
export default withAnon(Belajar);
