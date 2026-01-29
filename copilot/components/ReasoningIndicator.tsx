import { useLottie } from 'lottie-react';
import copilotAnimation from 'copilot/data/copilot-animation.json';
import loadingAnimation from 'copilot/data/loading.json';
import { useEffect, useState } from 'react';
import { FaCircleCheck } from 'react-icons/fa6';

function ReasoningStep({
    isFinished,
    text
}: {
    isFinished: boolean;
    text: string;
}): JSX.Element {
    const { View: LoadingAnimation } = useLottie({
        animationData: loadingAnimation,
        loop: true
    });

    return (
        <div className="flex items-center gap-3">
            <div className="shrink-0 w-5 h-5 grid place-items-center">
                {isFinished ? (
                    <FaCircleCheck className="text-[#B6A6F3]" />
                ) : (
                    LoadingAnimation
                )}
            </div>
            <p className="text-[#999999] text-xs">{text}</p>
        </div>
    );
}

function ReasoningIndicator(): JSX.Element {
    const [isFinished, setIsFinished] = useState(false);
    const [reasoningSteps, setReasoningSteps] = useState([
        {
            isFinished: false,
            text: 'Inisialisasi konteks belajar kamu...'
        }
    ]);

    const { View: CopilotAnimation } = useLottie({
        animationData: copilotAnimation,
        loop: true
    });

    const isLastSequenceFinished =
        reasoningSteps.length === 3 && reasoningSteps[2].isFinished;

    useEffect(() => {
        let timeout;
        if (isLastSequenceFinished) {
            timeout = setTimeout(() => {
                setIsFinished(true);
            }, 1000);
        } else {
            timeout = setTimeout(() => {
                setReasoningSteps((items) => {
                    items[items.length - 1].isFinished = true;
                    if (items.length === 1) {
                        const newItem = {
                            isFinished: false,
                            text: 'Membedah skor Try Out & pola jawaban salah...'
                        };
                        items.push(newItem);
                    } else if (items.length === 2) {
                        const newItem = {
                            isFinished: false,
                            text: 'Finalisasi strategi belajar personal...'
                        };
                        items.push(newItem);
                    }
                    return [...items];
                });
            }, 1000);
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [isLastSequenceFinished, reasoningSteps]);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="shrink-0 w-8 h-8">{CopilotAnimation}</div>
                <span className="text-[#DEDEDE] text-xs">
                    {isFinished
                        ? 'Selesai...'
                        : isLastSequenceFinished
                        ? 'Proses finalisasi...'
                        : 'Sedang berpikir...'}
                </span>
            </div>

            <div className="space-y-4">
                {reasoningSteps.map((item) => (
                    <ReasoningStep
                        key={item.text}
                        isFinished={item.isFinished}
                        text={item.text}
                    />
                ))}
            </div>
        </div>
    );
}

export { ReasoningIndicator };
