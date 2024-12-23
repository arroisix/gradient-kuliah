import React from 'react';

interface LainnyaIconProps {
    className?: string;
    width?: number;
    height?: number;
}

const LainnyaIcon: React.FC<LainnyaIconProps> = ({
    className = '',
    width = 25,
    height = 24
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}>
            <g clipPath="url(#clip0_40000593_37530)">
                <rect
                    x="13.5"
                    y="13"
                    width="10"
                    height="10"
                    rx="2.1"
                    fill="#505A96"
                />
                <rect
                    x="13.5"
                    y="1"
                    width="10"
                    height="10"
                    rx="2.1"
                    fill="#505A96"
                />
                <rect
                    x="1.5"
                    y="13"
                    width="10"
                    height="10"
                    rx="2.1"
                    fill="#505A96"
                />
                <rect
                    x="0.376709"
                    y="2.4646"
                    width="10"
                    height="10"
                    rx="2.1"
                    transform="rotate(-15 0.376709 2.4646)"
                    fill="#7D89CC"
                />
            </g>
            <defs>
                <clipPath id="clip0_40000593_37530">
                    <rect
                        width="24"
                        height="24"
                        fill="white"
                        transform="translate(0.5)"
                    />
                </clipPath>
            </defs>
        </svg>
    );
};

export default LainnyaIcon;
