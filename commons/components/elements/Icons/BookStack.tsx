import React from 'react';

interface BookStackIconProps {
    size?: number;
    className?: string;
    fill?: string;
}

const BookStackIcon: React.FC<BookStackIconProps> = ({
    size = 20,
    className,
    fill = 'none'
}) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill={fill}
            xmlns="http://www.w3.org/2000/svg"
            className={className}>
            <path
                d="M6.25 3.125H3.75C3.40482 3.125 3.125 3.40482 3.125 3.75V16.25C3.125 16.5952 3.40482 16.875 3.75 16.875H6.25C6.59518 16.875 6.875 16.5952 6.875 16.25V3.75C6.875 3.40482 6.59518 3.125 6.25 3.125Z"
                stroke="currentColor"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M3.125 6.25H6.875"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10 3.125H7.5C7.15482 3.125 6.875 3.40482 6.875 3.75V16.25C6.875 16.5952 7.15482 16.875 7.5 16.875H10C10.3452 16.875 10.625 16.5952 10.625 16.25V3.75C10.625 3.40482 10.3452 3.125 10 3.125Z"
                stroke="currentColor"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M6.875 13.75H10.625"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M13.7139 2.91968L11.2889 3.56968C10.954 3.65942 10.7554 4.00361 10.8451 4.33843L14.0951 16.4634C14.1849 16.7983 14.529 16.9969 14.8639 16.9072L17.2889 16.2572C17.6237 16.1674 17.8224 15.8233 17.7326 15.4884L14.4826 3.36343C14.3929 3.02861 14.0487 2.82993 13.7139 2.91968Z"
                stroke="currentColor"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M13.375 14.0004L17 13.0238"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M11.4375 6.75L15.0625 5.78125"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default BookStackIcon;
