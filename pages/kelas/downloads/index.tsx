import { Layout } from 'commons/components/Layout';
import { cn } from 'commons/utils';
import DownloadsContainer from 'courses/containers/Downloads';
import { GetStaticProps } from 'next';
import { wrapper } from 'redux/store';

const Downloads = (): JSX.Element => {
    return (
        <Layout>
            <div className={cn('m-4', 'lg:mx-12 lg:my-8')}>
                <DownloadsContainer />
            </div>
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
    () => async () => {
        const META_TITLE = 'Daftar Download Video Perkuliahan Gradient Academy';
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
