const Skeleton = ({
    className = 'h-52'
}: {
    className?: string;
}): JSX.Element => {
    return (
        <div
            className={`p-4 w-full bg-neutral-600 animate-pulse rounded-lg mb-4 ${className}`}
        />
    );
};

export default Skeleton;
