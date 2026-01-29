import { useLottie } from 'lottie-react';
import copilotAnimation from 'copilot/data/copilot-animation.json';

function LoadingIndicator(): JSX.Element {
    const { View: CopilotAnimation } = useLottie({
        animationData: copilotAnimation,
        loop: true
    });

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="shrink-0 w-8 h-8">{CopilotAnimation}</div>
            <span className="text-[#DEDEDE] text-xs">Tunggu sebentar...</span>
        </div>
    );
}

export { LoadingIndicator };
