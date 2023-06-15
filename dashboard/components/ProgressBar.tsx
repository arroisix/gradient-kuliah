const ProgressBar = ({ percent = '0%' }: { percent?: string }): JSX.Element => {
    return (
        <div>
            <div className="relative w-[180px] h-[10px] rounded-[10px] overflow-hidden">
                <div className="absolute w-full h-full bg-[#D9D9D9] rounded-[10px]"></div>
                <div
                    className="absolute h-full bg-[#D9B8FF] rounded-[10px]"
                    style={{ width: percent }}></div>
            </div>
            <span className="text-xs">
                Progress Belajar:{' '}
                <span className="text-accent-green">{percent}</span>
            </span>
        </div>
    );
};

export default ProgressBar;
