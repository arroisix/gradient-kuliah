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
    const META_TITLE =
        'Kumpulan Rangkuman, Catatan & Buku Materi Kuliah | Gradient';
    const META_DESCRIPTION =
        'Tingkatkan hasil belajar dari rangkuman & catatan berkualitas yang dirancang khusus agar lebih praktis serta mempercepat waktu Kamu dalam proses belajar.';

    return {
        props: {
            canonical: 'https://gradient.academy/astronotes',
            title: META_TITLE,
            description: META_DESCRIPTION,
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
                        alt: 'Gradient Logo'
                    }
                ]
            }
        }
    };
};

AstronotesEntrypointPage.displayName = 'Library';
export default AstronotesEntrypointPage;
