import React from 'react';
import { cn } from '../../../utils';

interface BookStackIconFillProps {
    className?: string;
    color?: string;
}

const BookStackIconFill: React.FC<BookStackIconFillProps> = ({
    className,
    color = 'currentColor'
}) => {
    return (
        <svg
            className={cn('w-6 h-6', className)}
            viewBox="0 0 20 20"
            fill="none">
            <rect
                x={3.33325}
                y={2.5}
                width={3.33333}
                height={3.33333}
                rx={1}
                fill={color}
            />
            <rect
                x={3.33325}
                y={6.66669}
                width={3.33333}
                height={10.8333}
                rx={1}
                fill={color}
            />
            <rect
                width={3.33333}
                height={3.33333}
                rx={1}
                transform="matrix(1 0 0 -1 7.5 17.5)"
                fill={color}
            />
            <rect
                width={3.33333}
                height={3.33333}
                rx={1}
                transform="matrix(0.962403 -0.271624 -0.271624 -0.962403 14.5999 17.6682)"
                fill={color}
            />
            <rect
                width={3.33333}
                height={3.33333}
                rx={1}
                transform="matrix(0.962403 -0.271624 -0.271624 -0.962403 11.4309 6.43933)"
                fill={color}
            />
            <rect
                width={3.33333}
                height={10.8333}
                rx={1}
                transform="matrix(1 0 0 -1 7.5 13.3333)"
                fill={color}
            />
            <rect
                width={3.33333}
                height={7.34018}
                rx={1}
                transform="matrix(0.962403 -0.271624 -0.271624 -0.962403 13.5623 13.9909)"
                fill={color}
            />
        </svg>
    );
};

export default BookStackIconFill;
