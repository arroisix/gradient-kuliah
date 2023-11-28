import { slugify } from 'commons/utils';
import Link from 'next/link';
import React from 'react';

const MobileBlockquote = ({ headings }: LegalTocProps): JSX.Element => {
    return (
        <div className="block md:hidden callout">
            <h2 className="text-neutral-400">Daftar Isi</h2>
            {headings.map((heading) => (
                <Link
                    href={`#${slugify(heading)}`}
                    key={heading}
                    className="font-sans text-sm font-bold text-white hover:text-accent-purple">
                    {heading}
                </Link>
            ))}
        </div>
    );
};

export default MobileBlockquote;
