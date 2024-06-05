import Button from 'commons/components/elements/Button';
import { useRouter } from 'next/router';
import React from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

type PageNavigationProps = {
    next?: string;
    prev?: string;
};

export const PageNavigation = ({
    next,
    prev
}: PageNavigationProps): JSX.Element => {
    const { query } = useRouter();
    const { slug } = query as { slug: string };
    return (
        <nav className="fixed md:relative bottom-0 inset-x-0 bg-black p-4 gap-2.5 grid grid-cols-2 md:flex z-10 md:p-0">
            <Button
                href={
                    !!prev ? `/perpustakaan/textbook/${slug}/${prev}` : undefined
                }
                disabled={!prev}
                variant="neutral"
                className="flex items-center justify-center !pl-3"
                eventName="User Click Back Question of Textbook"
                eventPayload={{ 'Book Slug': slug }}>
                <BiChevronLeft className="w-6 h-6" />
                Back
            </Button>
            <Button
                href={
                    !!next ? `/perpustakaan/textbook/${slug}/${next}` : undefined
                }
                disabled={!next}
                variant="primary"
                className="flex items-center justify-center !pr-3"
                eventName="User Click Next Question of Textbook"
                eventPayload={{ 'Book Slug': slug }}>
                Next
                <BiChevronRight className="w-6 h-6" />
            </Button>
        </nav>
    );
};
