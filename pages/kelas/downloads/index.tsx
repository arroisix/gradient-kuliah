import LearnLayout from 'commons/learnLayout';
import { GetStaticProps } from 'next';
import { wrapper } from 'redux/store';
import DownloadsContainer from '../../../courses/containers/Downloads';

const Downloads = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <DownloadsContainer />
        </LearnLayout>
    );
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
    () => async () => {
        const META_TITLE =
            'Daftar Download Video Perkuliahan Gradient Academy';
        const META_DESCRIPTION =
            'Akses dan kelola video perkuliahan yang telah kamu download melalui aplikasi mobile Gradient Academy';

        return {
            props: {
                title: META_TITLE,
                description: META_DESCRIPTION,
                canonical: `https://gradient.academy/lihat-download`,
                openGraph: {
                    type: 'website',
                    title: META_TITLE,
                    description: META_DESCRIPTION,
                    url: `https://gradient.academy`,
                    images: [
                        {
                            url: 'https://assets.gradient.academy/assets/gradient-G-icon.png',
                            width: 48,
                            height: 48,
                            alt: 'Gradient Academy'
                        }
                    ]
                }
            },
            revalidate: 60
        };
    }
);

Downloads.displayName = 'Downloads';
export default Downloads;
