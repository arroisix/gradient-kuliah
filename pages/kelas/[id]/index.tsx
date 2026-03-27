import Layout from 'commons/layout';
import { GetStaticProps, GetStaticPaths } from 'next';
import { wrapper } from 'redux/store';
import config from 'redux/api/config';
import LandingPageOrchestrator from 'courses/components/LandingPage/LandingPageOrchestrator';
import axios from 'axios';
import { CourseJsonLd } from 'next-seo';

const DetailKelas = ({
    id,
    packetOffer,
    courseData,
    courseRating,
    title,
    description,
    recommendations
}: {
    id: string;
    packetOffer: PacketOffer[];
    courseData: CourseLandingPageData;
    courseRating: GetCourseRatingResponse;
    title: string;
    description: string;
    recommendations: GetCourseRecommendationResponse;
}): JSX.Element => {
    return (
        <>
            <CourseJsonLd
                courseName={title}
                description={description}
                provider={{
                    type: 'EducationalOrganization',
                    name: 'Gradient',
                    url: 'https://gradient.academy'
                }}
                hasCourseInstance={{
                    '@type': 'CourseInstance',
                    name: title,
                    description: description,
                    courseMode: 'online',
                    courseSchedule: {
                        '@type': 'Schedule',
                        repeatCount: 18,
                        repeatFrequency: 'Weekly'
                    },
                    instructor: courseData?.lecturers.map(
                        (lecturer: Lecturer) => ({
                            '@type': 'Person',
                            name: lecturer.name,
                            description: lecturer.role,
                            image: lecturer.photo
                        })
                    )
                }}
                offers={{
                    '@type': 'Offer',
                    category: 'Subscription',
                    priceCurrency: 'IDR',
                    priceSpecification: packetOffer?.map(
                        ({ packet_name, price }) => ({
                            '@type': 'UnitPriceSpecification',
                            name: packet_name,
                            price: price
                        })
                    )
                }}
                isAccessibleForFree={false}
                aggregateRating={
                    courseRating?.rating_count > 0
                        ? {
                              '@type': 'AggregateRating',
                              ratingValue: courseRating?.average_rating,
                              bestRating: courseRating?.best_rating,
                              worstRating: courseRating?.worst_rating,
                              ratingCount: courseRating?.rating_count
                          }
                        : undefined
                }
            />
            <Layout shouldTransparent>
                <LandingPageOrchestrator
                    id={id}
                    packetOffer={packetOffer}
                    course={courseData}
                    recommendations={recommendations}
                />
            </Layout>
        </>
    );
};

DetailKelas.displayName = 'Course Landing';
export default DetailKelas;

export const getStaticPaths: GetStaticPaths = async () => {
    try {
        const courseSlug = await fetch(
            `${config.API_BASE_URL}courses/public/landing/`
        );

        const result: ResponseData<string> = await courseSlug.json();

        return {
            paths: result.data.map((slug: string) => ({ params: { id: slug } })),
            fallback: 'blocking'
        };
    } catch (error) {
        console.log('API not available during build, using empty paths');
        return {
            paths: [],
            fallback: 'blocking'
        };
    }
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
    () =>
        async ({ params }) => {
            try {
                const [
                    courseResponse,
                    pricingResponse,
                    ratingResponse,
                    recommendationResponse
                ] = await Promise.all([
                    axios.get<CourseLandingPageData>(
                        `${config.API_BASE_URL}courses/public/landing/${params?.id}`
                    ),
                    axios.get<ResponseData<PacketOffer>>(
                        `${config.API_BASE_URL}subscriptions/packet-offer/`
                    ),
                    axios.get<GetCourseRatingResponse>(
                        `${config.API_BASE_URL}courses/public/${params?.id}/rating/`
                    ),
                    axios.get<GetCourseRecommendationResponse>(
                        `${config.API_BASE_URL}learning-experiences/recommendations/courses/${params?.id}/`
                    )
                ]);

                const courseData = courseResponse.data;
                const packetOffer = pricingResponse.data.data;
                const courseRating = ratingResponse.data;
                const recommendations = recommendationResponse.data;

                if (!courseData) {
                    // Resource truly missing -> permanent redirect to 404
                    return {
                        redirect: {
                            destination: `/404`,
                            permanent: true
                        }
                    };
                }

                const metaTitle =
                    params?.id === 'bedah-jurusan'
                        ? 'Program Webinar Bedah Jurusan Kuliah Bersama Expert'
                        : `Kelas Online ${courseData?.course_name}, Materi Belajar Super Interaktif`;
                const metaDescription =
                    params?.id === 'bedah-jurusan'
                        ? 'Program webinar gratis! Temukan wawasan mendalam tentang jurusan kuliah favorit Kamu dari para ahli yang telah berpengalaman dan sukses berkarir dibidangnya.'
                        : `Ikuti kelas interaktif ${courseData?.course_name} bersama dosen ternama di Indonesia. Belajar jadi mudah dengan materi video & latihan soal beserta pembahasannya.`;

                return {
                    props: {
                        id: params?.id,
                        courseData,
                        packetOffer,
                        courseRating,
                        recommendations,
                        canonical: `https://gradient.academy/kelas/${courseData.course_slug}`,
                        title: metaTitle,
                        description: metaDescription,
                        openGraph: {
                            type: 'website',
                            title: metaTitle,
                            description: metaDescription,
                            url: `https://gradient.academy/kelas/${params?.id}`,
                            images: [
                                {
                                    url: courseData.cover,
                                    width: 400,
                                    height: 250,
                                    alt: courseData?.course_name
                                },
                                ...courseData.lecturers.map(
                                    (lecturer: Lecturer) => ({
                                        url: lecturer.photo,
                                        width: 200,
                                        heigth: 300,
                                        alt: lecturer.name
                                    })
                                ),
                                {
                                    url: 'https://assets.gradient.academy/assets/gradient-G-icon.png',
                                    width: 48,
                                    height: 48,
                                    alt: 'Gradient Academy'
                                }
                            ]
                        }
                    },
                    revalidate: 300
                };
            } catch (err: any) {
                console.error('getStaticProps error for', { params }, err);

                // If API returned 404 -> permanent redirect (or notFound: true)
                const status = err?.response?.status;
                if (status === 404) {
                    return {
                        redirect: {
                            destination: `/404`,
                            permanent: true
                        }
                    };
                }

                // Auth errors -> redirect to login (non-permanent)
                if (status === 401 || status === 403) {
                    return {
                        redirect: {
                            destination: `/masuk?redirect=${encodeURIComponent(
                                `/kelas/${params?.id}`
                            )}`,
                            permanent: false
                        }
                    };
                }

                // Transient error -> return safe fallback props and retry soon
                return {
                    props: {
                        // Page component must handle these nulls (see "client handling" below)
                        id: params?.id,
                        courseData: null,
                        packetOffer: null,
                        courseRating: null,
                        recommendations: null,
                        __errorMessage:
                            'Gagal memuat data. Silakan coba lagi nanti.'
                    } as any,
                    revalidate: 30
                };
            }
        }
);
