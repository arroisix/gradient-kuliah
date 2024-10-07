import React from 'react';
import { useRouter } from 'next/router';
import SectionPageContent from 'courses/components/Latihan/Section/SectionPageContent';

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
