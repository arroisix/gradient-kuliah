const ValueProposition = (): JSX.Element => {
    return (
        <div className="flex flex-col w-full">
            <div className="flex w-full mb-8">
                <div className="w-full h-screen"></div>
                <div className="w-full h-screen sticky-card sticky-1"></div>
            </div>
            <div className="flex w-full mb-8">
                <div className="w-full h-screen"></div>
                <div className="w-full h-screen sticky-card sticky-2"></div>
            </div>
            <div className="flex w-full mb-8">
                <div className="w-full h-screen"></div>
                <div className="w-full h-screen sticky-card sticky-3"></div>
            </div>
        </div>
    );
};

export default ValueProposition;
