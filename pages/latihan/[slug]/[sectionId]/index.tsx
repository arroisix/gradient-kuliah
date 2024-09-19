import React from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const SectionPageContent = dynamic(
    () => import('courses/components/Latihan/Section/SectionPageContent'),
    {
        ssr: false
    }
);

const SectionPage: React.FC = () => {
    const router = useRouter();
    const { slug, sectionId } = router.query;

    if (!slug || !sectionId) {
        return <div>Loading...</div>;
    }

    return (
        <SectionPageContent
            slug={slug as string}
            sectionId={sectionId as string}
        />
    );
};

export default SectionPage;
