import axios from 'axios';
import CryptoJS from 'crypto-js';
import { VideoJsonLd } from 'next-seo';
import moment from 'moment';
import type { GetStaticPaths, GetStaticPropsResult } from 'next';
import config from 'redux/api/config';
import LearnLayout from 'commons/learnLayout';
import VideoLearnContainer from 'courses/containers/learn/video';
import { LearningProvider } from 'courses/contexts/LearningProvider';
import { VideoTranscriptProvider } from 'courses/contexts/VideoTranscriptProvider';
import { MateriLearnContainer } from 'courses/containers/utbk/MateriLearnContainer';

interface BelajarPageProps {
    subchapter: SubChapter | null;
    course: CourseDetail | null;
    book: BookDetailInterface | null;
    content: string | null;
    recommendations: GetVideoRecommendationResponse | null;
}

const Belajar = ({
    subchapter,
    course,
    book,
    content,
    recommendations
}: BelajarPageProps): JSX.Element => {
    return (
        <>
            <LearningProvider>
                <VideoTranscriptProvider>
                    <div className="w-screen min-h-screen bg-black py-4 lg:hidden">
                        <MateriLearnContainer
                            subchapter={subchapter}
                            course={course}
                            book={book}
                            content={content}
                        />
                    </div>

                    <div className="hidden lg:block">
                        <LearnLayout noPadding showSubscriptionReminder>
                            <VideoLearnContainer
                                subchapter={subchapter as SubChapter}
                                course={course as CourseDetail}
                                recommendations={
                                    recommendations as GetVideoRecommendationResponse
                                }
                            />
                        </LearnLayout>
                    </div>
                </VideoTranscriptProvider>
            </LearningProvider>

            <VideoJsonLd
                name={subchapter?.subchapter_name}
                learningResourceType="Concept Overview"
                contentUrl={subchapter?.video?.video_url}
                thumbnailUrls={[subchapter?.video?.thumbnail as string]}
                uploadDate={moment(
                    new Date(subchapter?.created_at ?? new Date())
                ).format('YYYY-MM-DD')}
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
}): Promise<GetStaticPropsResult<BelajarPageProps>> => {
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
        let book: BookDetailInterface | null = null;
        let content: string | null = null;

        if (!subchapter) {
            return { notFound: true };
        }

        if (subchapter.type_name === 'notebook') {
            const page = subchapter.notebook?.page;
            const bookSlug = subchapter.notebook?.book_slug;
            const FRONTEND_ACCESS_TOKEN = process.env.FRONTEND_ACCESS_TOKEN;

            const [getBookContent, getBookDetail] = await Promise.all([
                page === 1
                    ? axios.get<GetAstronotesContentResponse>(
                          `${config.API_BASE_URL}books/public/${bookSlug}/preview/`
                      )
                    : axios.get<GetAstronotesContentResponse>(
                          `${config.API_BASE_URL}books/${bookSlug}?page=${page}`,
                          {
                              headers: {
                                  'X-Special-Request': FRONTEND_ACCESS_TOKEN
                              }
                          }
                      ),
                axios.get<GetBookDetailResponse>(
                    `${config.API_BASE_URL}books/${bookSlug}/detail/`
                )
            ]);

            const encryptedContent = CryptoJS.AES.encrypt(
                JSON.stringify(getBookContent.data),
                FRONTEND_ACCESS_TOKEN as string
            );

            book = getBookDetail.data.book;
            content =
                page === 1
                    ? JSON.stringify(getBookContent.data)
                    : encryptedContent.toString();
        }

        return {
            props: { subchapter, course, book, content, recommendations },
            revalidate: 60 * 60
        };
    } catch (error: any) {
        console.error('getStaticProps error for', { id, slug }, error);

        const status = error?.response?.status;
        if (status === 404) {
            return {
                redirect: {
                    destination: '/404',
                    permanent: true
                }
            };
        }

        return {
            props: {
                subchapter: null,
                course: null,
                book: null,
                content: null,
                recommendations: null,
                __errorMessage: 'Could not load data, please try again later'
            } as any,
            revalidate: 30
        };
    }
};

export default Belajar;
