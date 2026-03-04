import { ComponentPropsWithoutRef } from 'react';

function BlockOutlineIcon({
    className,
    ...rest
}: ComponentPropsWithoutRef<'svg'>): JSX.Element {
    return (
        <svg
            className={className}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            {...rest}>
            <g clipPath="url(#clip0_40006516_81257)">
                <path
                    d="M6.66683 14.6667V4.66667C6.66683 4.48986 6.59659 4.32029 6.47157 4.19526C6.34654 4.07024 6.17697 4 6.00016 4H2.66683C2.31321 4 1.97407 4.14048 1.72402 4.39052C1.47397 4.64057 1.3335 4.97971 1.3335 5.33333V13.3333C1.3335 13.687 1.47397 14.0261 1.72402 14.2761C1.97407 14.5262 2.31321 14.6667 2.66683 14.6667H10.6668C11.0205 14.6667 11.3596 14.5262 11.6096 14.2761C11.8597 14.0261 12.0002 13.687 12.0002 13.3333V10C12.0002 9.82319 11.9299 9.65362 11.8049 9.5286C11.6799 9.40357 11.5103 9.33333 11.3335 9.33333H1.3335"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M14.0002 1.33325H10.0002C9.63197 1.33325 9.3335 1.63173 9.3335 1.99992V5.99992C9.3335 6.36811 9.63197 6.66659 10.0002 6.66659H14.0002C14.3684 6.66659 14.6668 6.36811 14.6668 5.99992V1.99992C14.6668 1.63173 14.3684 1.33325 14.0002 1.33325Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_40006516_81257">
                    <rect width="16" height="16" fill="currentColor" />
                </clipPath>
            </defs>
        </svg>
    );
}

export { BlockOutlineIcon };
