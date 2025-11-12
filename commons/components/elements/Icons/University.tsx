interface UniversityIconProps {
    color?: string;
    size?: number;
}

const UniversityIcon = ({ color, size }: UniversityIconProps) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M7 2L1 5L7 8L13 5L7 2Z"
                stroke={color}
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M3 6L3 8.88136C3 9.81356 4.77778 11 7 11C9.22222 11 11 9.81356 11 8.88136V6"
                stroke={color}
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default UniversityIcon;
