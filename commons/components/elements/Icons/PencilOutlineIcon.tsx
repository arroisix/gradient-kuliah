import { ComponentPropsWithoutRef } from 'react';

function PencilOutlineIcon({
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
                d="M5.40527 18.3232L4.40332 18.498C4.33759 18.5074 4.29135 18.4522 4.30078 18.3984L4.30176 18.3965L4.47559 17.3936L5.40527 18.3232ZM16.416 9.59375L8.76953 17.2412L8.58105 17.0332L7.26855 15.5811L7.24512 15.5547L7.21875 15.5312L5.76465 14.2168L5.55664 14.0293L13.2051 6.38184L16.416 9.59375ZM16.2314 3.35547C16.5708 3.01609 17.1261 3.01416 17.4707 3.35645L19.4434 5.3291C19.7842 5.6682 19.7862 6.22117 19.4424 6.56543L18.1445 7.8623L14.9346 4.65137L16.2314 3.35547Z"
                stroke="currentColor"
                strokeWidth="1.4"
            />
            <line
                x1="2.90039"
                y1="22.3008"
                x2="21.1004"
                y2="22.3008"
                stroke="currentColor"
                strokeLinecap="round"
            />
        </svg>
    );
}

export { PencilOutlineIcon };
