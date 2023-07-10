const ProgressBar = ({
    total_finished_video,
    total_video_count
}: {
    total_finished_video: number;
    total_video_count: number;
}): JSX.Element => {
    const percentage = (total_finished_video / total_video_count) * 100;
    return (
        <div className="flex flex-col gap-[10px]">
            <div className="relative w-full h-[6px] rounded-[100px] overflow-hidden">
                <div className="absolute w-full h-full bg-[#FFFFFF1A] rounded-[10px]"></div>
                <div
                    className="absolute h-full bg-accent-purple rounded-[100px]"
                    style={{ width: `${percentage}%` }}></div>
            </div>
            <span className="text-xs font-body text-[#FFFFFF80]">
                {`${total_finished_video} of ${total_video_count} Compeleted `}
                <span className="text-white">{`(${percentage}%)`}</span>
            </span>
        </div>
    );
};

export default ProgressBar;
