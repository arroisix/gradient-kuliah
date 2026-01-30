import { ComponentPropsWithoutRef } from 'react';

function LiveClassOutline({
    className,
    ...rest
}: ComponentPropsWithoutRef<'svg'>): JSX.Element {
    return (
        <svg
            className={className}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...rest}>
            <path
                d="M10.0133 16.5625C10.0636 18.3435 9.73686 19.0798 8.01807 19.5625"
                stroke="currentColor"
            />
            <path
                d="M14.0228 16.5625C13.9726 18.3435 14.2993 19.0798 16.0181 19.5625"
                stroke="currentColor"
            />
            <path
                d="M5.51562 19.5625H18.5156"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <rect
                x="3.51562"
                y="5.0625"
                width="17"
                height="12"
                rx="1.5"
                stroke="currentColor"
            />
            <circle
                cx="12.0156"
                cy="8.5625"
                r="1.5"
                fill="currentColor"
                stroke="currentColor"
            />
            <mask id="path-6-inside-1_40009491_31422" fill="white">
                <path d="M16.0156 15.5625C16.0156 15.0372 15.9122 14.5171 15.7111 14.0318C15.5101 13.5465 15.2155 13.1055 14.8441 12.7341C14.4726 12.3626 14.0317 12.068 13.5464 11.867C13.0611 11.666 12.5409 11.5625 12.0156 11.5625C11.4903 11.5625 10.9702 11.666 10.4849 11.867C9.99959 12.068 9.55863 12.3626 9.1872 12.7341C8.81576 13.1055 8.52113 13.5465 8.32011 14.0318C8.11909 14.5171 8.01562 15.0372 8.01563 15.5625L12.0156 15.5625H16.0156Z" />
            </mask>
            <path
                d="M16.0156 15.5625C16.0156 15.0372 15.9122 14.5171 15.7111 14.0318C15.5101 13.5465 15.2155 13.1055 14.8441 12.7341C14.4726 12.3626 14.0317 12.068 13.5464 11.867C13.0611 11.666 12.5409 11.5625 12.0156 11.5625C11.4903 11.5625 10.9702 11.666 10.4849 11.867C9.99959 12.068 9.55863 12.3626 9.1872 12.7341C8.81576 13.1055 8.52113 13.5465 8.32011 14.0318C8.11909 14.5171 8.01562 15.0372 8.01563 15.5625L12.0156 15.5625H16.0156Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                mask="url(#path-6-inside-1_40009491_31422)"
            />
            <circle cx="18.5156" cy="7.0625" r="0.5" fill="currentColor" />
        </svg>
    );
}

export { LiveClassOutline };
