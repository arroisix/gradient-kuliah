import { ComponentPropsWithoutRef } from 'react';

function LibrarySolidIcon({
    className,
    ...rest
}: ComponentPropsWithoutRef<'svg'>): JSX.Element {
    return (
        <svg
            className={className}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...rest}>
            <rect x="4" y="3" width="4" height="4" rx="1" fill="currentColor" />
            <rect
                x="4"
                y="8"
                width="4"
                height="13"
                rx="1"
                fill="currentColor"
            />
            <rect
                width="4"
                height="4"
                rx="1"
                transform="matrix(1 0 0 -1 9 21)"
                fill="currentColor"
            />
            <rect
                width="4"
                height="4"
                rx="1"
                transform="matrix(0.962403 -0.271624 -0.271624 -0.962403 17.5195 21.2012)"
                fill="currentColor"
            />
            <rect
                width="4"
                height="4"
                rx="1"
                transform="matrix(0.962403 -0.271624 -0.271624 -0.962403 13.7168 7.72656)"
                fill="currentColor"
            />
            <rect
                width="4"
                height="13"
                rx="1"
                transform="matrix(1 0 0 -1 9 16)"
                fill="currentColor"
            />
            <rect
                width="4"
                height="8.80822"
                rx="1"
                transform="matrix(0.962403 -0.271624 -0.271624 -0.962403 16.2754 16.7891)"
                fill="currentColor"
            />
        </svg>
    );
}

export { LibrarySolidIcon };
