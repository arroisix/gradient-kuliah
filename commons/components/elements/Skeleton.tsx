type SkeletonProps = {
    repeat?: number;
    className?: string;
};

const SingleSkeleton = ({ className = 'h-52' }: SkeletonProps): JSX.Element => {
    return (
        <div
            className={`p-4 w-full dark:bg-neutral-700 bg-neutral-200 animate-pulse rounded-lg mb-4 ${className}`}
        />
    );
};

const Skeleton = ({ className, repeat }: SkeletonProps): JSX.Element => {
    return repeat ? (
        <>
            {Array.from({ length: repeat }).map((_, i) => (
                <SingleSkeleton key={`sk-${i}`} className={className} />
            ))}
        </>
    ) : (
        <SingleSkeleton className={className} />
    );
};

export default Skeleton;
