import React from 'react';
import { useRouter } from 'next/router';
import SectionPageContent from 'latihan/components/Section/SectionPageContent';
import withAuth from 'commons/withAuth';

const SectionPage: React.FC = () => {
    const router = useRouter();
    const { slug, sectionId } = router.query;

    if (!slug || !sectionId) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="mt-4 text-white">Loading...</p>
            </div>
        );
    }

    return (
        <SectionPageContent
            slug={slug as string}
            sectionId={sectionId as string}
        />
    );
};

export default withAuth(SectionPage);
