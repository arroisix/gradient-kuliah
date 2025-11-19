interface FilterIconFillProps {
    width?: number;
    height?: number;
    className?: string;
}

const FilterIcon = ({ width, height, className }: FilterIconFillProps) => {
    return (
        <svg
            width={width || 16}
            height={height || 14}
            viewBox="0 0 16 14"
            className={className}
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M15.1992 0H0.80093C0.0903298 0 -0.268237 0.808312 0.235263 1.28034L6.4 8.06065V11.5C6.4 11.7447 6.52736 11.9741 6.74123 12.1144L8.34123 13.8638C8.86733 14.2091 9.6 13.8592 9.6 13.2494V8.06065L15.7649 1.28034C16.2674 0.80925 15.9113 0 15.1992 0Z"
                fill="white"
            />
        </svg>
    );
};

export default FilterIcon;
