import axios from 'axios';
import config from 'redux/api/config';
import type { GetStaticPaths, GetStaticPropsResult } from 'next';
import { LearningProvider } from 'courses/contexts/LearningProvider';
import { MateriLearnContainer } from 'courses/containers/utbk/MateriLearnContainer';

interface BelajarPageProps {
    subchapter: SubChapter | undefined;
    course: CourseDetail | undefined;
}

function BelajarPageProps({
    subchapter,
    course
}: BelajarPageProps): JSX.Element {
    return (
        <LearningProvider>
            <div className="w-screen min-h-screen bg-black px-8">
                <MateriLearnContainer subchapter={subchapter} course={course} />
            </div>
        </LearningProvider>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: true
    };
};

export const getStaticProps = async ({
    params
}: {
    params: { slug_subtest: string; slug_subchapter: string };
}): Promise<GetStaticPropsResult<BelajarPageProps>> => {
    const { slug_subtest, slug_subchapter } = params;
    try {
        const [subchapterResponse, courseResponse] = await Promise.all([
            axios.get<SubChapter>(
                `${config.API_BASE_URL}courses/v2/public/${slug_subtest}/subchapter/${slug_subchapter}/`
            ),
            axios.get<CourseDetailResponse>(
                `${config.API_BASE_URL}courses/${slug_subtest}`
            )
        ]);

        const subchapter = subchapterResponse.data;
        const course = courseResponse.data.course_detail;

        if (!subchapter) {
            // resource not found -> show 404
            return { notFound: true };
        }

        return {
            props: { subchapter, course },
            // normal ISR interval
            revalidate: 60 * 60
        };
    } catch (error: any) {
        console.error(
            'getStaticProps error for',
            { slug_subtest, slug_subchapter },
            error
        );

        // If the API returned 404-like status, surface as notFound
        const status = error?.response?.status;
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
                // you can pass an error flag/message to the page
                __errorMessage: 'Could not load data, please try again later'
            } as any,
            revalidate: 30 // retry in 30s
        };
    }
};

export default BelajarPageProps;
