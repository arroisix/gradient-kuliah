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
        fallback: false // can also be true or 'blocking'
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

            return {
                props: {
                    id: params?.id,
                    courseData,
                    title: `Belajar ${courseData?.course_name} | Materi dan Latihan Soal`,
                    description: `Belajar materi ${courseData?.course_name} dari video lengkap dan latihan soal serta pembahasan di Gradient`,
                    openGraph: {
                        type: 'website',
                        title: `Belajar ${courseData?.course_name} | Materi dan Latihan Soal`,
                        description: `Belajar materi ${courseData?.course_name} dari video lengkap dan latihan soal serta pembahasan di Gradient`,
                        url: `https://gradient.academy/kelas/${params?.id}`,
                        images: [
                            {
                                url: 'https://assets.gradient.academy/assets/gradient-G-icon.png',
                                width: 48,
                                height: 48,
                                alt: 'Gradient Logo'
                            }
                        ]
                    },
                    packetOffer: packetOfferData
                },
                revalidate: 300
            };
        }
);
