import { cn } from 'commons/utils';

type SkeletonProps = {
    repeat?: number;
    className?: string;
    isCustomSize?: boolean;
};

const SingleSkeleton = ({
    className = 'h-52',
    isCustomSize
}: SkeletonProps): JSX.Element => {
    return (
        <div
            className={cn(
                `dark:bg-neutral-700 bg-neutral-200 animate-pulse rounded-lg`,
                !isCustomSize && 'p-4 w-full  mb-4',
                className
            )}
        />
    );
};

const Skeleton = ({
    className,
    repeat,
    isCustomSize
}: SkeletonProps): JSX.Element => {
    return repeat ? (
        <>
            {Array.from({ length: repeat }).map((_, i) => (
                <SingleSkeleton
                    key={`sk-${i}`}
                    isCustomSize={isCustomSize}
                    className={className}
                />
            ))}
        </>
    ) : (
        <SingleSkeleton isCustomSize={isCustomSize} className={className} />
    );
};

export default Skeleton;
