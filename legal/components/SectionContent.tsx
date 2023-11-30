import { slugify } from 'commons/utils';
import React from 'react';

type SectionContentProps = LegalContent;

const SectionContent = ({
    heading,
    content
}: SectionContentProps): JSX.Element => {
    return (
        <div id={slugify(heading)} className="divide-y scroll-mt-20">
            <h2 className="pb-3 font-sans text-xl font-extrabold">{heading}</h2>
            <p className="pt-5 text-justify">{content}</p>
        </div>
    );
};

export default SectionContent;
