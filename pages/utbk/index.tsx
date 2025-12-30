import withAnon from 'commons/withAnon';
import UTBK from 'landing/containers/utbk';
import { GetStaticProps } from 'next';

export default withAnon(UTBK);

export const getStaticProps: GetStaticProps = () => {
    const META_TITLE = 'Materi UTBK dan Tryout Gratis UTBK 2026';
    const META_DESCRIPTION =
        'Persiapkan dirimu menghadapi UTBK 2026 dengan tryout UTBK gratis dari Gradient. Dapatkan pengalaman ujian sesungguhnya dan analisis hasil untuk meningkatkan performa belajarmu.';

    return {
        props: {
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
};
