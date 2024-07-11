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
}

const Belajar = ({
    subchapter,
    course,
    description
}: BelajarPageProps): JSX.Element => {
    return (
        <>
            <LearningProvider>
                <LearnLayout noPadding showSubscriptionReminder>
                    <VideoLearnContainer
                        subchapter={subchapter}
                        course={course}
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
    const { data: response } = await axios.get<
        ListResponseData<SubchapterPathResponse>
    >(
        `${config.API_BASE_URL}courses/subchapter/list-subchapter-with-video/?limit=10`
    );

    const paths = response.data.map(({ course_slug, subchapter_slug }) => ({
        params: { id: course_slug, slug: subchapter_slug }
    }));

    return {
        paths,
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

    const [subchapterResponse, courseResponse] = await Promise.all([
        axios.get<SubChapter>(
            `${config.API_BASE_URL}courses/v2/public/${id}/subchapter/${slug}/`
        ),
        axios.get<CourseDetailResponse>(`${config.API_BASE_URL}courses/${id}`)
    ]);
    const subchapter = subchapterResponse.data;
    const course = courseResponse.data.course_detail;

    const META_TITLE = `${course.course_name}: ${subchapter.subchapter_name}`;
    const META_DESCRIPTION = `Nonton Video ${subchapter.subchapter_name} kelas ${course.course_name} hanya di Gradient`;

    return {
        props: {
            subchapter,
            course,
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
