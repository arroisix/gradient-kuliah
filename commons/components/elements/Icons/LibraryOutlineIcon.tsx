import { ComponentPropsWithoutRef } from 'react';

function LibraryOutlineIcon({
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
            <path
                d="M7.5 3.75H4.5C4.08579 3.75 3.75 4.08579 3.75 4.5V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H7.5C7.91421 20.25 8.25 19.9142 8.25 19.5V4.5C8.25 4.08579 7.91421 3.75 7.5 3.75Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M3.75 7.5H8.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12 3.75H9C8.58579 3.75 8.25 4.08579 8.25 4.5V19.5C8.25 19.9142 8.58579 20.25 9 20.25H12C12.4142 20.25 12.75 19.9142 12.75 19.5V4.5C12.75 4.08579 12.4142 3.75 12 3.75Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8.25 16.5H12.75"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16.4559 3.50352L13.5459 4.28352C13.1441 4.39121 12.9057 4.80423 13.0134 5.20602L16.9134 19.756C17.0211 20.1578 17.4341 20.3962 17.8359 20.2885L20.7459 19.5085C21.1476 19.4008 21.3861 18.9878 21.2784 18.586L17.3784 4.03602C17.2707 3.63423 16.8576 3.39582 16.4559 3.50352Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16.0508 16.8008L20.4008 15.6289"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M13.7246 8.1L18.0746 6.9375"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export { LibraryOutlineIcon };
