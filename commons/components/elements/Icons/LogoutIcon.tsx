import { ComponentPropsWithoutRef } from 'react';

function LogoutIcon({
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
            <path
                d="M10.0007 2H4.66732C3.93094 2 3.33398 2.59695 3.33398 3.33333V12.6667C3.33398 13.4031 3.93094 14 4.66732 14H10.0007"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12.6667 8.00065L10 5.33398M12.6667 8.00065L10 10.6673M12.6667 8.00065H6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export { LogoutIcon };
