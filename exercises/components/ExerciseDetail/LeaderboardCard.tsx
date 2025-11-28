import React from 'react';
import { cn } from 'commons/utils';

interface LeaderboardCardProps {
    rank: number;
    username: string;
    university: string;
    score: number;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
    rank,
    username,
    university,
    score
}) => {
    const getBorderColor = (rank: number) => {
        switch (rank) {
            case 1:
                return 'border-[#FFD700]';
            case 2:
                return 'border-[#C0C0C0]';
            case 3:
                return 'border-[#CD7F32]';
            default:
                return 'border-[#3A3D4A]';
        }
    };

    return (
        <div
            className={cn(
                'flex items-center gap-4 p-4 rounded-2xl border w-full z-[2] bg-black',
                getBorderColor(rank)
            )}>
            {/* Rank Badge */}
            <div className="flex items-center justify-center flex-shrink-0">
                {rank === 1 && <Badge1 />}
                {rank === 2 && <Badge2 />}
                {rank === 3 && <Badge3 />}
                {rank > 3 && <BadgeNonTop3 />}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-base truncate">
                    {username}
                </h3>
                <p className="text-sm text-[#8B8FA3] truncate">{university}</p>
            </div>

            {/* Score */}
            <div className="text-3xl font-bold text-white flex-shrink-0">
                {score}
            </div>
        </div>
    );
};

const Badge1: React.FC = () => {
    return (
        <svg
            width="34"
            height="51"
            viewBox="0 0 34 51"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M7 46.278V30.9972C7 30.4449 7.44772 30 8 30H26C26.5523 30 27 30.4477 27 31V46.1857C27 46.9732 26.1319 47.4517 25.466 47.0312L18.0082 42.321C17.6955 42.1235 17.2993 42.1147 16.9781 42.2982L8.49614 47.1451C7.82948 47.526 7 47.0458 7 46.278Z"
                fill="url(#paint0_linear_1)"
            />
            <mask
                id="mask0_1"
                style={{ maskType: 'alpha' }}
                maskUnits="userSpaceOnUse"
                x="7"
                y="30"
                width="20"
                height="18">
                <path
                    d="M7 46.278V30.9972C7 30.4449 7.44772 30 8 30H26C26.5523 30 27 30.4477 27 31V46.1857C27 46.9732 26.1319 47.4517 25.466 47.0312L18.0082 42.321C17.6955 42.1235 17.2993 42.1147 16.9781 42.2982L8.49614 47.1451C7.82948 47.526 7 47.0458 7 46.278Z"
                    fill="url(#paint1_linear_1)"
                />
            </mask>
            <g mask="url(#mask0_1)">
                <g filter="url(#filter0_f_1)">
                    <circle cx="17" cy="22" r="17" fill="#9D6F21" />
                </g>
            </g>
            <rect
                x="1"
                y="4.5"
                width="32"
                height="32"
                rx="16"
                fill="url(#paint2_linear_1)"
            />
            <rect
                x="1"
                y="4.5"
                width="32"
                height="32"
                rx="16"
                stroke="url(#paint3_linear_1)"
                strokeWidth="2"
            />
            <path
                d="M18.9233 14.8636V26.5H16.8153V16.9148H16.7472L14.0256 18.6534V16.7216L16.9176 14.8636H18.9233Z"
                fill="white"
            />
            <defs>
                <filter
                    id="filter0_f_1"
                    x="-4"
                    y="1"
                    width="42"
                    height="42"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feGaussianBlur
                        stdDeviation="2"
                        result="effect1_foregroundBlur"
                    />
                </filter>
                <linearGradient
                    id="paint0_linear_1"
                    x1="17"
                    y1="24"
                    x2="17"
                    y2="53.5"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F2C04C" />
                    <stop offset="0.418269" stopColor="#E48E0D" />
                    <stop offset="1" stopColor="#E4B50D" />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_1"
                    x1="17"
                    y1="24"
                    x2="17"
                    y2="53.5"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F2C04C" />
                    <stop offset="0.418269" stopColor="#E48E0D" />
                    <stop offset="1" stopColor="#E4B50D" />
                </linearGradient>
                <linearGradient
                    id="paint2_linear_1"
                    x1="0"
                    y1="3.5"
                    x2="34.4876"
                    y2="7.81223"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#36236A" />
                    <stop offset="0.654204" stopColor="#6C5096" />
                    <stop offset="0.903636" stopColor="#494BA0" />
                </linearGradient>
                <linearGradient
                    id="paint3_linear_1"
                    x1="2.21655e-07"
                    y1="20.5"
                    x2="34"
                    y2="20.5"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#E4B50D" />
                    <stop offset="0.325" stopColor="#E48E0D" />
                    <stop offset="1" stopColor="#F2C04C" />
                </linearGradient>
            </defs>
        </svg>
    );
};

const Badge2: React.FC = () => {
    return (
        <svg
            width="34"
            height="51"
            viewBox="0 0 34 51"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M7 46.278V30.9972C7 30.4449 7.44772 30 8 30H26C26.5523 30 27 30.4477 27 31V46.1857C27 46.9732 26.1319 47.4517 25.466 47.0312L18.0082 42.321C17.6955 42.1235 17.2993 42.1147 16.9781 42.2982L8.49614 47.1451C7.82948 47.526 7 47.0458 7 46.278Z"
                fill="url(#paint0_linear_2)"
            />
            <mask
                id="mask0_2"
                style={{ maskType: 'alpha' }}
                maskUnits="userSpaceOnUse"
                x="7"
                y="30"
                width="20"
                height="18">
                <path
                    d="M7 46.278V30.9972C7 30.4449 7.44772 30 8 30H26C26.5523 30 27 30.4477 27 31V46.1857C27 46.9732 26.1319 47.4517 25.466 47.0312L18.0082 42.321C17.6955 42.1235 17.2993 42.1147 16.9781 42.2982L8.49614 47.1451C7.82948 47.526 7 47.0458 7 46.278Z"
                    fill="url(#paint1_linear_2)"
                />
            </mask>
            <g mask="url(#mask0_2)">
                <g filter="url(#filter0_f_2)">
                    <circle cx="17" cy="22" r="17" fill="#38445C" />
                </g>
            </g>
            <rect
                x="1"
                y="4.5"
                width="32"
                height="32"
                rx="16"
                fill="url(#paint2_linear_2)"
            />
            <rect
                x="1"
                y="4.5"
                width="32"
                height="32"
                rx="16"
                stroke="url(#paint3_linear_2)"
                strokeWidth="2"
            />
            <path
                d="M13.0653 26.5V24.9773L17.1051 21.017C17.4915 20.6269 17.8134 20.2803 18.071 19.9773C18.3286 19.6742 18.5218 19.3807 18.6506 19.0966C18.7794 18.8125 18.8438 18.5095 18.8438 18.1875C18.8438 17.8201 18.7604 17.5057 18.5938 17.2443C18.4271 16.9792 18.1979 16.7746 17.9062 16.6307C17.6146 16.4867 17.2831 16.4148 16.9119 16.4148C16.5294 16.4148 16.1941 16.4943 15.9062 16.6534C15.6184 16.8087 15.3949 17.0303 15.2358 17.3182C15.0805 17.6061 15.0028 17.9489 15.0028 18.3466H12.9972C12.9972 17.608 13.1657 16.9659 13.5028 16.4205C13.84 15.875 14.304 15.4527 14.8949 15.1534C15.4896 14.8542 16.1714 14.7045 16.9403 14.7045C17.7206 14.7045 18.4063 14.8504 18.9972 15.142C19.5881 15.4337 20.0464 15.8333 20.3722 16.3409C20.7017 16.8485 20.8665 17.428 20.8665 18.0795C20.8665 18.5152 20.7831 18.9432 20.6165 19.3636C20.4498 19.7841 20.1563 20.25 19.7358 20.7614C19.3191 21.2727 18.7339 21.892 17.9801 22.6193L15.9744 24.6591V24.7386H21.0426V26.5H13.0653Z"
                fill="white"
            />
            <defs>
                <filter
                    id="filter0_f_2"
                    x="-4"
                    y="1"
                    width="42"
                    height="42"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feGaussianBlur
                        stdDeviation="2"
                        result="effect1_foregroundBlur"
                    />
                </filter>
                <linearGradient
                    id="paint0_linear_2"
                    x1="8.66509"
                    y1="44.4803"
                    x2="18.943"
                    y2="22.0331"
                    gradientUnits="userSpaceOnUse">
                    <stop offset="0.0137306" stopColor="#8099B8" />
                    <stop offset="0.693816" stopColor="#404A5C" />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_2"
                    x1="17"
                    y1="24"
                    x2="17"
                    y2="53.5"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F2C04C" />
                    <stop offset="0.418269" stopColor="#E48E0D" />
                    <stop offset="1" stopColor="#E4B50D" />
                </linearGradient>
                <linearGradient
                    id="paint2_linear_2"
                    x1="-3.83203"
                    y1="25"
                    x2="44.668"
                    y2="16.5"
                    gradientUnits="userSpaceOnUse">
                    <stop offset="0.304538" stopColor="#8099B8" />
                    <stop offset="0.693816" stopColor="#404A5C" />
                </linearGradient>
                <linearGradient
                    id="paint3_linear_2"
                    x1="2.21655e-07"
                    y1="20.5"
                    x2="34"
                    y2="20.5"
                    gradientUnits="userSpaceOnUse">
                    <stop offset="0.325" stopColor="#5D6B85" />
                    <stop offset="1" stopColor="#8099B8" />
                </linearGradient>
            </defs>
        </svg>
    );
};

const Badge3: React.FC = () => {
    return (
        <svg
            width="34"
            height="51"
            viewBox="0 0 34 51"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M7 46.278V30.9972C7 30.4449 7.44772 30 8 30H26C26.5523 30 27 30.4477 27 31V46.1857C27 46.9732 26.1319 47.4517 25.466 47.0312L18.0082 42.321C17.6955 42.1235 17.2993 42.1147 16.9781 42.2982L8.49614 47.1451C7.82948 47.526 7 47.0458 7 46.278Z"
                fill="url(#paint0_linear_3)"
            />
            <mask
                id="mask0_3"
                style={{ maskType: 'alpha' }}
                maskUnits="userSpaceOnUse"
                x="7"
                y="30"
                width="20"
                height="18">
                <path
                    d="M7 46.278V30.9972C7 30.4449 7.44772 30 8 30H26C26.5523 30 27 30.4477 27 31V46.1857C27 46.9732 26.1319 47.4517 25.466 47.0312L18.0082 42.321C17.6955 42.1235 17.2993 42.1147 16.9781 42.2982L8.49614 47.1451C7.82948 47.526 7 47.0458 7 46.278Z"
                    fill="url(#paint1_linear_3)"
                />
            </mask>
            <g mask="url(#mask0_3)">
                <g filter="url(#filter0_f_3)">
                    <circle cx="17" cy="22" r="17" fill="#463121" />
                </g>
            </g>
            <rect
                x="1"
                y="4.5"
                width="32"
                height="32"
                rx="16"
                fill="url(#paint2_linear_3)"
            />
            <rect
                x="1"
                y="4.5"
                width="32"
                height="32"
                rx="16"
                stroke="url(#paint3_linear_3)"
                strokeWidth="2"
            />
            <path
                d="M17.4993 26.6591C16.6811 26.6591 15.9538 26.5189 15.3175 26.2386C14.6849 25.9583 14.1849 25.5682 13.8175 25.0682C13.45 24.5682 13.255 23.9905 13.2322 23.3352H15.3686C15.3875 23.6496 15.4917 23.9242 15.6811 24.1591C15.8705 24.3902 16.1224 24.5701 16.4368 24.6989C16.7512 24.8277 17.1035 24.892 17.4936 24.892C17.9103 24.892 18.2796 24.8201 18.6016 24.6761C18.9235 24.5284 19.1754 24.3239 19.3572 24.0625C19.5391 23.8011 19.6281 23.5 19.6243 23.1591C19.6281 22.8068 19.5372 22.4962 19.3516 22.2273C19.166 21.9583 18.897 21.7481 18.5447 21.5966C18.1963 21.4451 17.7758 21.3693 17.2834 21.3693H16.255V19.7443H17.2834C17.6887 19.7443 18.0429 19.6742 18.3459 19.5341C18.6527 19.3939 18.8932 19.197 19.0675 18.9432C19.2417 18.6856 19.3269 18.3883 19.3232 18.0511C19.3269 17.7216 19.2531 17.4356 19.1016 17.1932C18.9538 16.947 18.7436 16.7557 18.4709 16.6193C18.2019 16.483 17.8857 16.4148 17.522 16.4148C17.166 16.4148 16.8364 16.4792 16.5334 16.608C16.2304 16.7367 15.986 16.9205 15.8004 17.1591C15.6148 17.3939 15.5163 17.6742 15.505 18H13.4766C13.4917 17.3485 13.6792 16.7765 14.0391 16.2841C14.4027 15.7879 14.8875 15.4015 15.4936 15.125C16.0997 14.8447 16.7796 14.7045 17.5334 14.7045C18.3099 14.7045 18.9841 14.8504 19.5561 15.142C20.1319 15.4299 20.5769 15.8182 20.8913 16.3068C21.2057 16.7955 21.3629 17.3352 21.3629 17.9261C21.3667 18.5814 21.1735 19.1307 20.7834 19.5739C20.397 20.017 19.8894 20.3068 19.2607 20.4432V20.5341C20.0788 20.6477 20.7057 20.9508 21.1413 21.4432C21.5807 21.9318 21.7985 22.5398 21.7947 23.267C21.7947 23.9186 21.6091 24.5019 21.2379 25.017C20.8705 25.5284 20.3629 25.9299 19.7152 26.2216C19.0713 26.5133 18.3326 26.6591 17.4993 26.6591Z"
                fill="white"
            />
            <defs>
                <filter
                    id="filter0_f_3"
                    x="-4"
                    y="1"
                    width="42"
                    height="42"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feGaussianBlur
                        stdDeviation="2"
                        result="effect1_foregroundBlur"
                    />
                </filter>
                <linearGradient
                    id="paint0_linear_3"
                    x1="4.74586"
                    y1="41.3824"
                    x2="27.7596"
                    y2="37.4816"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#5D381D" />
                    <stop offset="0.499177" stopColor="#A57F64" />
                    <stop offset="0.956731" stopColor="#805535" />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_3"
                    x1="17"
                    y1="24"
                    x2="17"
                    y2="53.5"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F2C04C" />
                    <stop offset="0.418269" stopColor="#E48E0D" />
                    <stop offset="1" stopColor="#E4B50D" />
                </linearGradient>
                <linearGradient
                    id="paint2_linear_3"
                    x1="-3.83203"
                    y1="25"
                    x2="35.5"
                    y2="19"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#5D381D" />
                    <stop offset="0.499177" stopColor="#A57F64" />
                    <stop offset="0.956731" stopColor="#805535" />
                </linearGradient>
                <linearGradient
                    id="paint3_linear_3"
                    x1="2.21655e-07"
                    y1="20.5"
                    x2="34"
                    y2="20.5"
                    gradientUnits="userSpaceOnUse">
                    <stop offset="0.325" stopColor="#9D765A" />
                    <stop offset="1" stopColor="#643C1F" />
                </linearGradient>
            </defs>
        </svg>
    );
};

const BadgeNonTop3: React.FC = () => {
    return (
        <svg
            width="35"
            height="35"
            viewBox="0 0 35 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <rect
                x="0.5"
                y="0.5"
                width="34"
                height="34"
                rx="17"
                fill="url(#paint0_linear_non)"
            />
            <path
                d="M8.8544 23.5V21.9773L12.8942 18.017C13.2805 17.6269 13.6025 17.2803 13.8601 16.9773C14.1177 16.6742 14.3108 16.3807 14.4396 16.0966C14.5684 15.8125 14.6328 15.5095 14.6328 15.1875C14.6328 14.8201 14.5495 14.5057 14.3828 14.2443C14.2161 13.9792 13.987 13.7746 13.6953 13.6307C13.4036 13.4867 13.0722 13.4148 12.701 13.4148C12.3184 13.4148 11.9832 13.4943 11.6953 13.6534C11.4074 13.8087 11.1839 14.0303 11.0249 14.3182C10.8696 14.6061 10.7919 14.9489 10.7919 15.3466H8.78622C8.78622 14.608 8.95478 13.9659 9.2919 13.4205C9.62902 12.875 10.093 12.4527 10.6839 12.1534C11.2786 11.8542 11.9605 11.7045 12.7294 11.7045C13.5097 11.7045 14.1953 11.8504 14.7862 12.142C15.3771 12.4337 15.8355 12.8333 16.1612 13.3409C16.4908 13.8485 16.6555 14.428 16.6555 15.0795C16.6555 15.5152 16.5722 15.9432 16.4055 16.3636C16.2389 16.7841 15.9453 17.25 15.5249 17.7614C15.1082 18.2727 14.523 18.892 13.7692 19.6193L11.7635 21.6591V21.7386H16.8317V23.5H8.8544ZM22.968 23.6591C22.1499 23.6591 21.4226 23.5189 20.7862 23.2386C20.1536 22.9583 19.6536 22.5682 19.2862 22.0682C18.9188 21.5682 18.7237 20.9905 18.701 20.3352H20.8374C20.8563 20.6496 20.9605 20.9242 21.1499 21.1591C21.3393 21.3902 21.5911 21.5701 21.9055 21.6989C22.2199 21.8277 22.5722 21.892 22.9624 21.892C23.379 21.892 23.7483 21.8201 24.0703 21.6761C24.3923 21.5284 24.6442 21.3239 24.826 21.0625C25.0078 20.8011 25.0968 20.5 25.093 20.1591C25.0968 19.8068 25.0059 19.4962 24.8203 19.2273C24.6347 18.9583 24.3658 18.7481 24.0135 18.5966C23.665 18.4451 23.2446 18.3693 22.7521 18.3693H21.7237V16.7443H22.7521C23.1574 16.7443 23.5116 16.6742 23.8146 16.5341C24.1214 16.3939 24.362 16.197 24.5362 15.9432C24.7105 15.6856 24.7957 15.3883 24.7919 15.0511C24.7957 14.7216 24.7218 14.4356 24.5703 14.1932C24.4226 13.947 24.2124 13.7557 23.9396 13.6193C23.6707 13.483 23.3544 13.4148 22.9908 13.4148C22.6347 13.4148 22.3052 13.4792 22.0021 13.608C21.6991 13.7367 21.4548 13.9205 21.2692 14.1591C21.0836 14.3939 20.9851 14.6742 20.9737 15H18.9453C18.9605 14.3485 19.148 13.7765 19.5078 13.2841C19.8714 12.7879 20.3563 12.4015 20.9624 12.125C21.5684 11.8447 22.2483 11.7045 23.0021 11.7045C23.7786 11.7045 24.4529 11.8504 25.0249 12.142C25.6006 12.4299 26.0457 12.8182 26.3601 13.3068C26.6745 13.7955 26.8317 14.3352 26.8317 14.9261C26.8355 15.5814 26.6423 16.1307 26.2521 16.5739C25.8658 17.017 25.3582 17.3068 24.7294 17.4432V17.5341C25.5476 17.6477 26.1745 17.9508 26.6101 18.4432C27.0495 18.9318 27.2673 19.5398 27.2635 20.267C27.2635 20.9186 27.0779 21.5019 26.7067 22.017C26.3393 22.5284 25.8317 22.9299 25.1839 23.2216C24.54 23.5133 23.8014 23.6591 22.968 23.6591Z"
                fill="white"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_non"
                    x1="0.5"
                    y1="0.5"
                    x2="34.9876"
                    y2="4.81223"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#36236A" />
                    <stop offset="0.654204" stopColor="#6C5096" />
                    <stop offset="0.903636" stopColor="#494BA0" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default LeaderboardCard;
