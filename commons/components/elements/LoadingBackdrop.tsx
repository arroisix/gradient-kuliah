import Spinner from './Spinner';

const LoadingBackdrop = (): JSX.Element => {
    return (
        <div className="fixed h-screen w-screen left-0 top-0 bg-black flex flex-col justify-center items-center z-[1000] gap-2">
            <Spinner size="medium" />
            <span className="animate-pulse text-4xl font-bold cursor-pointer font-[Urbanist]">
                Gradient
            </span>
        </div>
    );
};

export default LoadingBackdrop;
