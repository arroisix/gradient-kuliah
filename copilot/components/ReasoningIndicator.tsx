import { useLottie } from 'lottie-react';
import copilotAnimation from 'copilot/data/copilot-animation.json';
import loadingAnimation from 'copilot/data/loading.json';
import { FaCircleCheck } from 'react-icons/fa6';
import { Reasoning } from 'copilot/types/copilot';
import { cn } from 'commons/utils';

interface ReasoningStepProps {
    isFinished?: boolean;
    thought: string;
    withIcon?: boolean;
}

function ReasoningStep({
    isFinished = false,
    thought,
    withIcon = true
}: ReasoningStepProps): JSX.Element {
    const { View: LoadingAnimation } = useLottie({
        animationData: loadingAnimation,
        loop: true
    });

    return (
        <div className="flex items-center gap-3">
            {withIcon ? (
                <div className="shrink-0 w-5 h-5 grid place-items-center">
                    {isFinished ? (
                        <FaCircleCheck className="text-[#B6A6F3]" />
                    ) : (
                        LoadingAnimation
                    )}
                </div>
            ) : (
                <></>
            )}

            <p
                className={cn(
                    'text-xs',
                    withIcon ? 'text-[#999999]' : 'text-[#DEDEDE]'
                )}>
                {thought}
            </p>
        </div>
    );
}

interface ReasoningIndicatorProps {
    reasoning: Reasoning;
    mode?: 'single' | 'stacked';
}

function ReasoningIndicator({
    reasoning,
    mode = 'stacked'
}: ReasoningIndicatorProps): JSX.Element {
    const { View: CopilotAnimation } = useLottie({
        animationData: copilotAnimation,
        loop: true
    });

    return (
        <div className="space-y-6">
            {mode === 'single' ? (
                <div className="flex items-center gap-3">
                    <div className="shrink-0 w-8 h-8">{CopilotAnimation}</div>
                    <span className="text-[#DEDEDE] text-xs">
                        {reasoning.isFinished ? (
                            'Selesai...'
                        ) : reasoning.thoughts.length > 0 ? (
                            <ReasoningStep
                                withIcon={false}
                                thought={
                                    reasoning.thoughts[
                                        reasoning.thoughts.length - 1
                                    ]
                                }
                            />
                        ) : (
                            'Sedang berpikir...'
                        )}
                    </span>
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-3">
                        <div className="shrink-0 w-8 h-8">
                            {CopilotAnimation}
                        </div>
                        <span className="text-[#DEDEDE] text-xs">
                            {reasoning.isFinished
                                ? 'Selesai...'
                                : 'Sedang berpikir...'}
                        </span>
                    </div>

                    <div className="space-y-4">
                        {reasoning.thoughts.map((thought, index) => (
                            <ReasoningStep
                                key={`${thought}:${index}`}
                                thought={thought}
                                isFinished={
                                    index < reasoning.thoughts.length - 1 ||
                                    reasoning.isFinished
                                }
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export { ReasoningIndicator };
