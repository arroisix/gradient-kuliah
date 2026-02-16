import { ComponentPropsWithoutRef } from 'react';

function HomeOutlineIcon({
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
                d="M11.8359 4.13379C11.9299 4.0524 12.0701 4.0524 12.1641 4.13379L20.4824 11.3408C20.6569 11.4924 20.5497 11.7793 20.3184 11.7793H20C19.0335 11.7793 18.2501 12.5629 18.25 13.5293V19C18.25 19.6904 17.6904 20.25 17 20.25H14C13.8619 20.25 13.75 20.1381 13.75 20V15.6475C13.75 14.681 12.9665 13.8975 12 13.8975C11.0335 13.8975 10.25 14.681 10.25 15.6475V20C10.25 20.1381 10.1381 20.25 10 20.25H7C6.30964 20.25 5.75 19.6904 5.75 19V13.5293C5.74994 12.5629 4.96646 11.7793 4 11.7793H3.68164C3.45034 11.7793 3.34313 11.4924 3.51758 11.3408L11.8359 4.13379Z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
        </svg>
    );
}

export { HomeOutlineIcon };
