import React from 'react';
import { cn } from '../../../utils';

interface HomeIconFillProps {
    className?: string;
    color?: string;
}

const HomeIconFill: React.FC<HomeIconFillProps> = ({
    className,
    color = 'currentColor'
}) => {
    return (
        <svg
            className={cn('w-6 h-6', className)}
            viewBox="0 0 20 20"
            fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.3335 17.5005C7.88578 17.5005 8.3335 17.0528 8.3335 16.5005V13.2064C8.3335 12.6541 8.78121 12.2064 9.3335 12.2064H10.6668C11.2191 12.2064 11.6668 12.6541 11.6668 13.2064V16.5005C11.6668 17.0528 12.1145 17.5005 12.6668 17.5005H13.8335C14.9381 17.5005 15.8335 16.6051 15.8335 15.5005V11.3471C15.8335 10.847 16.2389 10.4417 16.7389 10.4417C17.5771 10.4417 17.9653 9.40078 17.3318 8.85192L10.6549 3.06773C10.2791 2.74216 9.7212 2.74216 9.34539 3.06773L2.66857 8.85192C2.03501 9.40078 2.42318 10.4417 3.26142 10.4417C3.76146 10.4417 4.16683 10.847 4.16683 11.3471V15.5005C4.16683 16.6051 5.06226 17.5005 6.16683 17.5005H7.3335Z"
                fill={color}
            />
        </svg>
    );
};

export default HomeIconFill;
