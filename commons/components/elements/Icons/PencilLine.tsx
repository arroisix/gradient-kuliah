import React from 'react';

interface PencilOnLineIconProps {
    size?: number;
    className?: string;
}

const PencilOnLineIcon: React.FC<PencilOnLineIconProps> = ({
    size = 20,
    className
}) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}>
            <path
                d="M3.71039 15.2902L3.80704 14.7362L4.26392 15.1931L3.71039 15.2902ZM13.5162 7.99467L7.31251 14.1983L7.23762 14.1154L6.14435 12.9057L6.12063 12.8794L6.09438 12.8557L4.88247 11.7603L4.80101 11.6867L11.0046 5.48311L13.5162 7.99467ZM3.01049 15.2302L3.01029 15.2301L3.01049 15.2302ZM16.1195 4.52191L16.1208 4.52323C16.359 4.76019 16.3609 5.14723 16.1195 5.38867L15.1214 6.38673L12.6112 3.87654L13.6092 2.87849C13.8463 2.64142 14.235 2.63934 14.4768 2.87924C14.477 2.87943 14.4772 2.87962 14.4773 2.87981L16.1195 4.52191Z"
                stroke="currentColor"
                strokeWidth="1.4"
            />
            <line
                x1="2.5"
                y1="18.5"
                x2="17.5"
                y2="18.5"
                stroke="currentColor"
                strokeLinecap="round"
            />
        </svg>
    );
};

export default PencilOnLineIcon;
