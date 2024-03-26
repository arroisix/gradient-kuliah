import LearnLayout from 'commons/learnLayout';
import AstronotesEntrypoint from 'courses/containers/learn/astronotes/entrypoint';
import { GetStaticProps } from 'next';
import React from 'react';

const AstronotesEntrypointPage = (): JSX.Element => {
    return (
        <>
            <LearnLayout showSidebar fullHeightSidebar>
                <AstronotesEntrypoint />
            </LearnLayout>
        </>
    );
};

export const getStaticProps: GetStaticProps = () => {
    return {
        props: {
            canonical: 'https://gradient.academy/astronotes',
            title: 'Catatan, Rangkuman dan Bank Soal dari Gradient',
            description:
                'Catatan, Rangkuman dan Bank Soal yang disusun oleh Gradient, demi kemudahan mahasiswa dalam mempelajari materi perkuliahan',
            openGraph: {
                type: 'website',
                title: 'Catatan, Rangkuman dan Bank Soal dari Gradient',
                description:
                    'Catatan, Rangkuman dan Bank Soal yang disusun oleh Gradient, demi kemudahan mahasiswa dalam mempelajari materi perkuliahan',
                url: `https://gradient.academy`,
                images: [
                    {
                        url: 'https://assets.gradient.academy/assets/gradient-G-icon.png',
                        width: 48,
                        height: 48,
                        alt: 'Gradient Logo'
                    }
                ]
            }
        }
    };
};

AstronotesEntrypointPage.displayName = 'Library';
export default AstronotesEntrypointPage;
