import { useLottie } from 'lottie-react';
import gradientAnimation from 'commons/data/gradient-animation.json';

const LoadingBackdrop = (): JSX.Element => {
    const options = {
        animationData: gradientAnimation,
        loop: true
    };

    const { View } = useLottie(options);
    return (
        <div className="fixed h-screen w-screen left-0 top-0 bg-black flex flex-col justify-center items-center z-[1000] gap-2">
            {View}
        </div>
    );
};

export default LoadingBackdrop;
