import axios from 'axios';
import withAnon from 'commons/withAnon';
import UTBK from 'landing/containers/utbk';
import type { GetStaticProps } from 'next';
import config from 'redux/api/config';

export default withAnon(UTBK);

export const getStaticProps: GetStaticProps = async () => {
    const META_TITLE = 'Materi UTBK dan Tryout Gratis UTBK 2026';
    const META_DESCRIPTION =
        'Persiapkan dirimu menghadapi UTBK 2026 dengan tryout UTBK gratis dari Gradient. Dapatkan pengalaman ujian sesungguhnya dan analisis hasil untuk meningkatkan performa belajarmu.';

    try {
        const { data: coursesResponse } = await axios.get<
            ListResponseData<Course>
        >(`${config.API_BASE_URL}courses/v2/public?type=UTBK`);

        return {
            props: {
                courses: coursesResponse.data,
                title: META_TITLE,
                description: META_DESCRIPTION,
                canonical: `https://gradient.academy/utbk`,
                openGraph: {
                    type: 'website',
                    title: META_TITLE,
                    description: META_DESCRIPTION,
                    url: `https://gradient.academy/utbk`,
                    images: [
                        {
                            url: 'https://assets.gradient.academy/assets/gradient-G-icon.png',
                            width: 48,
                            height: 48,
                            alt: 'Gradient UTBK'
                        }
                    ]
                }
            },
            revalidate: 60
        };
    } catch (error) {
        console.error('getStaticProps error for', error);

        // Transient error (network, 5xx, timeouts) -> return a safe fallback props
        // and a short revalidate so ISR retries soon
        return {
            props: {
                courses: [],
                // you can pass an error flag/message to the page
                __errorMessage: 'Could not load data, please try again later'
            } as any,
            revalidate: 30 // retry in 30s
        };
    }
};
