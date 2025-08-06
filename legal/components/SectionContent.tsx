import { slugify } from 'commons/utils';
import React from 'react';
import DOMPurify from 'isomorphic-dompurify';

type SectionContentProps = LegalContent;

const SectionContent = ({
    heading,
    content
}: SectionContentProps): JSX.Element => {
    const clean = DOMPurify.sanitize(content);
    return (
        <div id={slugify(heading)} className="divide-y scroll-mt-20">
            <h2 className="pb-3 font-sans text-xl font-extrabold">{heading}</h2>
            <p
                className="pt-5 text-justify"
                dangerouslySetInnerHTML={{
                    __html: clean
                }}
            />
        </div>
    );
};

export default SectionContent;
