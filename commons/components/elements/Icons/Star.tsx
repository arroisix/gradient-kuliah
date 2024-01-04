import React from 'react';

function Star(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
            {...props}>
            <path
                fill="url(#paint0_linear_6933_26793)"
                d="M15.722 7.663C10.162 6.596 9.404 5.837 8.337.278a.343.343 0 00-.674 0C6.597 5.838 5.838 6.596.278 7.663a.343.343 0 000 .674c5.56 1.067 6.319 1.826 7.385 7.385a.343.343 0 00.674 0c1.067-5.559 1.826-6.318 7.385-7.385a.343.343 0 000-.674z"></path>
            <defs>
                <linearGradient
                    id="paint0_linear_6933_26793"
                    x1="1.5"
                    x2="16"
                    y1="12.5"
                    y2="7"
                    gradientUnits="userSpaceOnUse">
                    <stop offset="0.315" stopColor="#7756AF"></stop>
                    <stop offset="0.581" stopColor="#7264EB"></stop>
                    <stop offset="0.831" stopColor="#7756AF"></stop>
                </linearGradient>
            </defs>
        </svg>
    );
}

export default Star;
