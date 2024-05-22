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
    courseData
}: {
    id: string;
    packetOffer: PacketOffer[];
    courseData: CourseLandingPageData;
}): JSX.Element => {
    return (
        <>
            <CourseJsonLd
                courseName={courseData?.course_name}
                description={courseData?.description}
                provider={{
                    name: 'Gradient Academy',
                    url: `https://gradient.academy`
                }}
                offers={[
                    {
                        '@type': 'Offer',
                        category: 'Subscription',
                        priceCurrency: 'IDR',
                        price: 125000
                    }
                ]}
                hasCourseInstance={[
                    {
                        '@type': 'CourseInstance',
                        courseMode: 'Online',
                        courseSchedule: {
                            '@type': 'Schedule',
                            repeatCount: 18,
                            repeatFrequency: 'Weekly'
                        },
                        instructor: [
                            courseData?.lecturers.map((lecturer: Lecturer) => ({
                                '@type': 'Person',
                                name: lecturer.name,
                                description: lecturer.role,
                                image: lecturer.photo
                            }))
                        ]
                    }
                ]}
            />
            <Layout shouldTransparent>
                <LandingPageOrchestrator id={id} packetOffer={packetOffer} />
            </Layout>
        </>
    );
};

DetailKelas.displayName = 'Course Landing';
export default DetailKelas;

export const getStaticPaths: GetStaticPaths = async () => {
    const courseSlug = await fetch(
        `${config.API_BASE_URL}courses/public/landing/`
    );

    const result: ResponseData<string> = await courseSlug.json();

    return {
        paths: result.data.map((slug: string) => ({ params: { id: slug } })),
        fallback: 'blocking' // can also be true or 'blocking'
    };
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
    () =>
        async ({ params }) => {
            const { data: courseData } = await axios.get<CourseLandingPageData>(
                `${config.API_BASE_URL}courses/public/landing/${params?.id}`
            );
            const {
                data: { data: packetOfferData }
            } = await axios.get<ResponseData<PacketOffer>>(
                `${config.API_BASE_URL}subscriptions/packet-offer/`
            );

            const metaTitle =
                params?.id === 'bedah-jurusan'
                    ? 'Program Webinar Bedah Jurusan Kuliah Bersama Expert | Gradient'
                    : `Kelas Online ${courseData?.course_name}, Materi Belajar Super Interaktif | Gradient`;
            const metaDescription =
                params?.id === 'bedah-jurusan'
                    ? 'Program webinar gratis! Temukan wawasan mendalam tentang jurusan kuliah favorit Kamu dari para ahli yang telah berpengalaman dan sukses berkarir dibidangnya.'
                    : `Ikuti kelas interaktif ${courseData?.course_name} bersama dosen ternama di Indonesia. Belajar jadi mudah dengan materi video & latihan soal beserta pembahasannya.`;

            return {
                props: {
                    id: params?.id,
                    courseData,
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
                    },
                    packetOffer: packetOfferData
                },
                revalidate: 300
            };
        }
);
