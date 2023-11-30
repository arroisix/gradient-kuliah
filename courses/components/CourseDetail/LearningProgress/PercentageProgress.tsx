import useCourseSubscription from 'courses/hooks/useCourseSubscription';

export const PercentageProgess = ({
    slug
}: GradientBaseComponentWithSlug): JSX.Element => {
    const { completion_percentage } = useCourseSubscription(slug);
    return (
        <div className="flex flex-col w-full gap-2">
            <div className="relative w-full h-2 overflow-hidden bg-gray-500 rounded-full">
                <div
                    style={{
                        width: `${
                            (completion_percentage?.total_finished_video /
                                completion_percentage?.total_video_count) *
                            100
                        }%`
                    }}
                    className={`h-2 absolute rounded-full left-0 z-10 bg-[#D9B8FF]`}
                />
            </div>
            <div>
                Progress Belajar:
                <span className="ml-2 font-semibold text-green-500">
                    {Math.round(
                        (completion_percentage?.total_finished_video /
                            completion_percentage?.total_video_count) *
                            100
                    )}
                    %
                </span>
            </div>
        </div>
    );
};
