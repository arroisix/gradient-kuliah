import React, { useMemo } from 'react';
import PRIVACY_POLICY from '../data/privacyPolicy.json';
import SectionContent from 'legal/components/SectionContent';
import LegalSidebar from 'legal/components/TableOfContent/Sidebar';
import MobileBlockquote from 'legal/components/TableOfContent/MobileBlockquote';
import MobileBottomsheet from 'legal/components/TableOfContent/MobileBottomsheet';
import Breadcrumb from 'commons/components/modules/Breadcrumb';

const PrivacyPolicy = (): JSX.Element => {
    const headings = useMemo(
        () => PRIVACY_POLICY.sections.map((section) => section.heading),
        []
    );

    return (
        <div className="w-full max-w-screen-lg px-4 py-24 mx-auto flex flex-col gap-5">
            <Breadcrumb className="md:px-10" />
            <div className="relative grid grid-cols-1 md:gap-4 lg:gap-8 md:px-6 md:grid-cols-3 lg:grid-cols-4 font-body overflow-x-clip">
                <LegalSidebar headings={headings} />
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <p className="text-neutral-400">
                        Terakhir diubah: {PRIVACY_POLICY.lastUpdatedDate}
                    </p>
                    <div className="pt-2 space-y-8 md:space-y-12">
                        <h1 className="font-sans text-3xl font-extrabold">
                            {PRIVACY_POLICY.title}
                        </h1>
                        <MobileBlockquote headings={headings} />
                        {PRIVACY_POLICY.sections.map((section) => (
                            <SectionContent
                                key={section.heading}
                                heading={section.heading}
                                content={section.content}
                            />
                        ))}
                    </div>
                </div>
                <MobileBottomsheet headings={headings} />
            </div>
        </div>
    );
};

export default PrivacyPolicy;
