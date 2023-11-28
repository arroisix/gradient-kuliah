import { cn, slugify } from 'commons/utils';
import Link from 'next/link';
import React from 'react';

const LegalSidebar = ({ headings, className }: LegalTocProps): JSX.Element => {
    return (
        <div
            className={cn(
                'hidden w-full p-4 md:block bg-neutral-800 rounded-box',
                className
            )}>
            <div className="sticky top-20">
                <h2 className="pb-5 text-sm uppercase font-body text-neutral-400">
                    Daftar Isi
                </h2>
                <div className="overflow-y-auto max-h-[calc(100vh_-_10rem)] space-y-4">
                    {headings.map((heading) => (
                        <Link
                            href={`#${slugify(heading)}`}
                            key={heading}
                            className="block font-sans text-sm font-bold hover:text-accent-purple">
                            {heading}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LegalSidebar;
