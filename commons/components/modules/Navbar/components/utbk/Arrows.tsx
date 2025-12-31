import React from 'react';

export function ArrowRight(props: React.ComponentProps<'svg'>): JSX.Element {
    return (
        <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <path
                d="M15 5C14.4181 5 14 5.50476 14 6C14 6.25443 14.0865 6.48001 14.2881 6.68164L17.7539 10.1465L18.6074 11H3C2.44814 11 2 11.4481 2 12C2 12.5519 2.44814 13 3 13H18.6074L17.7539 13.8535L14.2881 17.3184C14.0865 17.52 14 17.7456 14 18C14 18.4954 14.4175 19 15 19C15.2626 19 15.4831 18.9099 15.6807 18.7119L15.6816 18.7109L21.6621 12.7314C21.7911 12.6024 21.8662 12.5127 21.916 12.416C21.9617 12.3273 22 12.2047 22 12C22 11.8089 21.9581 11.6769 21.9033 11.5742C21.845 11.4649 21.7623 11.3688 21.6504 11.2568L15.6816 5.28809H15.6807C15.4831 5.09005 15.2626 5 15 5ZM22.4893 11.8057H22.4883H22.4893ZM13.668 6.67969H13.667H13.668Z"
                fill="white"
            />
        </svg>
    );
}

export function ArrowSvg(props: React.ComponentProps<'svg'>): JSX.Element {
    return (
        <svg
            width={21}
            height={15}
            viewBox="0 0 21 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <foreignObject x={-64} y={-64} width={149} height={142.73}>
                <div
                    style={{
                        backdropFilter: 'blur(32px)',
                        clipPath: 'url(#bgblur_0_40007249_168575_clip_path)',
                        height: '100%',
                        width: '100%'
                    }}
                />
            </foreignObject>
            <path
                data-figma-bg-blur-radius={64}
                d="M14.001 2.06555L21 14.7305H0L6.99903 2.06555C8.5208 -0.688124 12.4792 -0.688128 14.001 2.06555Z"
                fill="black"
                fillOpacity={0.9}
            />
            <defs>
                <clipPath
                    id="bgblur_0_40007249_168575_clip_path"
                    transform="translate(64 64)">
                    <path d="M14.001 2.06555L21 14.7305H0L6.99903 2.06555C8.5208 -0.688124 12.4792 -0.688128 14.001 2.06555Z" />
                </clipPath>
            </defs>
        </svg>
    );
}
