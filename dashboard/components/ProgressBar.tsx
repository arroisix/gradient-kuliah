const ProgressBar = ({
    percent = '0%',
    className
}: { percent?: string } & PropsWithClassName): JSX.Element => {
    return (
        <div className={className}>
            <div className="relative max-w-[180px] h-[4px] sm:h-[6px] rounded-[10px] overflow-hidden">
                <div className="absolute w-full h-full bg-[#FFFFFF33] rounded-[10px]"></div>
                <div
                    className="absolute h-full bg-accent-purple rounded-[10px]"
                    style={{ width: percent }}></div>
            </div>
            <span className="inline-block pt-[6px] font-body text-xs">
                Progress Terakhir Menonton:{' '}
                <span className="inline-block text-state-success">
                    {percent}
                </span>
            </span>
        </div>
    );
};

export default ProgressBar;
