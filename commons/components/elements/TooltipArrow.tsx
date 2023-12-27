import { SVGProps } from 'react';

export default function TooltipArrow(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="16"
            fill="none"
            viewBox="0 0 30 16"
            {...props}>
            <path
                fill="#272727"
                d="M18.073 14.313a4 4 0 01-6.146 0L0 0h30L18.073 14.313z"></path>
        </svg>
    );
}
