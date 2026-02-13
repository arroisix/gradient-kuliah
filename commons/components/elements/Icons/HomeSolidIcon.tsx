import { ComponentPropsWithoutRef } from 'react';

function HomeSolidIcon({
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
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 21C9.55229 21 10 20.5523 10 20V15.6471C10 15.0948 10.4477 14.6471 11 14.6471H13C13.5523 14.6471 14 15.0948 14 15.6471V20C14 20.5523 14.4477 21 15 21H17C18.1046 21 19 20.1046 19 19V13.5294C19 12.9771 19.4477 12.5294 20 12.5294H20.3184C21.2442 12.5294 21.673 11.3798 20.9732 10.7736L12.6548 3.56724C12.279 3.24167 11.721 3.24167 11.3452 3.56724L3.02678 10.7736C2.32704 11.3798 2.75575 12.5294 3.68156 12.5294H4C4.55228 12.5294 5 12.9771 5 13.5294V19C5 20.1046 5.89543 21 7 21H9Z"
                fill="currentColor"
            />
        </svg>
    );
}

export { HomeSolidIcon };
