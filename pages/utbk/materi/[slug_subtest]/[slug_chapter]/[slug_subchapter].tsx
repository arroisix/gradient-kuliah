import axios from 'axios';
import config from 'redux/api/config';
import type { GetStaticPaths, GetStaticPropsResult } from 'next';
import { LearningProvider } from 'courses/contexts/LearningProvider';
import { MateriLearnContainer } from 'courses/containers/utbk/MateriLearnContainer';
import { VideoTranscriptProvider } from 'courses/contexts/VideoTranscriptProvider';
import CryptoJS from 'crypto-js';

export interface BelajarPageProps {
    subchapter: SubChapter | null;
    course: CourseDetail | null;
    book: BookDetailInterface | null;
    content: string | null;
}

function BelajarPageProps({
    subchapter,
    course,
    book,
    content
}: BelajarPageProps): JSX.Element {
    return (
        <LearningProvider>
            <VideoTranscriptProvider>
                <div className="w-screen min-h-screen bg-black py-4">
                    <MateriLearnContainer
                        subchapter={subchapter}
                        course={course}
                        book={book}
                        content={content}
                    />
                </div>
            </VideoTranscriptProvider>
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
        let book: BookDetailInterface | null = null;
        let content: string | null = null;

        if (!subchapter) {
            // resource not found -> show 404
            return { notFound: true };
        }

        if (subchapter.type_name === 'notebook') {
            const page = subchapter.notebook?.page;
            const slug = subchapter.notebook?.book_slug;
            const FRONTEND_ACCESS_TOKEN = process.env.FRONTEND_ACCESS_TOKEN;

            const [getBookContent, getBookDetail] = await Promise.all([
                page === 1
                    ? axios.get<GetAstronotesContentResponse>(
                          `${config.API_BASE_URL}books/public/${slug}/preview/`
                      )
                    : axios.get<GetAstronotesContentResponse>(
                          `${config.API_BASE_URL}books/${slug}?page=${page}`,
                          {
                              headers: {
                                  'X-Special-Request': FRONTEND_ACCESS_TOKEN
                              }
                          }
                      ),
                axios.get<GetBookDetailResponse>(
                    `${config.API_BASE_URL}books/${slug}/detail/`
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
            props: { subchapter, course, book, content },
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
                book: null,
                content: null,
                // you can pass an error flag/message to the page
                __errorMessage: 'Could not load data, please try again later'
            } as any,
            revalidate: 30 // retry in 30s
        };
    }
};

export default BelajarPageProps;
