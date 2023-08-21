import Layout from 'commons/layout';
import { GetStaticProps, GetStaticPaths } from 'next';
import { wrapper } from 'redux/store';
import { getLandingCourseData } from 'courses/redux/api/publicCourseApi';
import { getRunningQueriesThunk } from 'redux/api/baseApi';
import config from 'redux/api/config';
import LandingPageOrchestrator from 'courses/components/LandingPage/LandingPageOrchestrator';
import axios from 'axios';

const DetailKelas = ({
    id,
    packetOffer
}: {
    id: string;
    packetOffer: PacketOffer[];
}): JSX.Element => {
    return (
        <Layout shouldTransparent>
            <LandingPageOrchestrator id={id} packetOffer={packetOffer} />
        </Layout>
    );
};

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
    ({ dispatch }) =>
        async ({ params }) => {
            await dispatch<any>(
                getLandingCourseData.initiate(params?.id as string)
            );
            const { data }: { data: { data: PacketOffer[] } } = await axios.get(
                `${config.API_BASE_URL}subscriptions/packet-offer/`
            );

            await Promise.all([getRunningQueriesThunk()]);

            return {
                props: {
                    id: params?.id,
                    packetOffer: data.data
                },
                revalidate: 300
            };
        }
);
