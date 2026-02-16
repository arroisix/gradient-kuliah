import { ComponentPropsWithoutRef } from 'react';

function LiveClassOutlineIcon({
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
                d="M10.0128 16.5586C10.0631 18.3396 9.73637 19.0759 8.01758 19.5586"
                stroke="currentColor"
            />
            <path
                d="M14.0223 16.5586C13.9721 18.3396 14.2988 19.0759 16.0176 19.5586"
                stroke="currentColor"
            />
            <path
                d="M5.51562 19.5586H18.5156"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <rect
                x="3.51562"
                y="5.05859"
                width="17"
                height="12"
                rx="1.5"
                stroke="currentColor"
            />
            <circle
                cx="12.0156"
                cy="8.55859"
                r="1.5"
                fill="currentColor"
                stroke="currentColor"
            />
            <mask id="path-6-inside-1_40009100_78661" fill="white">
                <path d="M16.0156 15.5586C16.0156 15.0333 15.9122 14.5132 15.7111 14.0279C15.5101 13.5426 15.2155 13.1016 14.8441 12.7302C14.4726 12.3587 14.0317 12.0641 13.5464 11.8631C13.0611 11.6621 12.5409 11.5586 12.0156 11.5586C11.4903 11.5586 10.9702 11.6621 10.4849 11.8631C9.99959 12.0641 9.55863 12.3587 9.1872 12.7302C8.81576 13.1016 8.52113 13.5426 8.32011 14.0279C8.11909 14.5132 8.01562 15.0333 8.01563 15.5586L12.0156 15.5586H16.0156Z" />
            </mask>
            <path
                d="M16.0156 15.5586C16.0156 15.0333 15.9122 14.5132 15.7111 14.0279C15.5101 13.5426 15.2155 13.1016 14.8441 12.7302C14.4726 12.3587 14.0317 12.0641 13.5464 11.8631C13.0611 11.6621 12.5409 11.5586 12.0156 11.5586C11.4903 11.5586 10.9702 11.6621 10.4849 11.8631C9.99959 12.0641 9.55863 12.3587 9.1872 12.7302C8.81576 13.1016 8.52113 13.5426 8.32011 14.0279C8.11909 14.5132 8.01562 15.0333 8.01563 15.5586L12.0156 15.5586H16.0156Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                mask="url(#path-6-inside-1_40009100_78661)"
            />
            <circle cx="18.5156" cy="7.05859" r="0.5" fill="currentColor" />
        </svg>
    );
}

export { LiveClassOutlineIcon };
