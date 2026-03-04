import { useLottie } from 'lottie-react';
import gradientAnimation from 'commons/data/gradient-animation.json';
import { cn } from 'commons/utils';

const LoadingIndicator = (): JSX.Element => {
    const options = {
        animationData: gradientAnimation,
        loop: true
    };

    const { View } = useLottie(options);
    return (
        <div
            className={cn(
                'h-[calc(100vh-59px-56px)] grid place-items-center',
                'lg:w-full lg:h-full'
            )}>
            {View}
        </div>
    );
};

export default LoadingIndicator;
