import { useRef } from 'react';
import PromptBar from './PromptBar';
import ExamplePrompts from './ExamplePrompts';
import ActionButtons from './ActionButtons';
import { MainSectionProps } from '../../types/copilot';
import useWindowBreakpoints from '../../../commons/hooks/useWindowBreakpoints';
import { cn } from 'commons/utils';

const MainSection = ({ onSendMessage }: MainSectionProps): JSX.Element => {
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const promptBarRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFocusPrompt = () => {
        promptBarRef.current?.focus();
    };

    const handleImageCapture = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div
            className={cn(
                'flex-1 flex flex-col h-full bg-[#101010] overflow-hidden',
                !isMobileBreakpoints && 'px-4 md:px-8 lg:px-16'
            )}>
            <div
                className={cn(
                    'flex-1 min-h-0 overflow-y-auto',
                    isMobileBreakpoints && 'mt-16 mb-24'
                )}>
                <div className="flex flex-col md:items-center md:justify-center min-h-full max-w-3xl mx-auto w-full gap-4 py-8 px-4">
                    <h1 className="text-xl md:text-2xl font-bold text-center">
                        Lagi butuh bantuan apa sobat?
                    </h1>

                    <ActionButtons
                        onFocusPrompt={handleFocusPrompt}
                        onImageCapture={handleImageCapture}
                    />

                    <div
                        className={cn(
                            'w-full',
                            !isMobileBreakpoints && 'max-w-[360px]'
                        )}>
                        <p className="text-neutral-400 mb-4">
                            Psst... kamu bisa nanya kayak gini:
                        </p>
                        <ExamplePrompts onPromptClick={onSendMessage} />
                    </div>
                </div>
            </div>

            <div
                className={cn(
                    'w-full max-w-3xl mx-auto',
                    isMobileBreakpoints
                        ? 'fixed bottom-8 left-0 right-0 bg-[#101010] pb-6'
                        : 'mb-8'
                )}>
                <PromptBar
                    ref={promptBarRef}
                    fileInputRef={fileInputRef}
                    onSend={onSendMessage}
                />
            </div>
        </div>
    );
};

export default MainSection;
