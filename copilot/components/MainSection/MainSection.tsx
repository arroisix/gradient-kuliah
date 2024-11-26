import PromptBar from './PromptBar';
import ExamplePrompts from './ExamplePrompts';
import { MainSectionProps } from '../../types/copilot';
import useWindowBreakpoints from '../../../commons/hooks/useWindowBreakpoints';
import { cn } from 'commons/utils';

const MainSection = ({ onSendMessage }: MainSectionProps): JSX.Element => {
    const { isMobileBreakpoints } = useWindowBreakpoints();

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
                <div className="flex flex-col items-center justify-center min-h-full max-w-3xl mx-auto w-full gap-8 py-8 px-4">
                    <h1 className="text-2xl font-bold text-center">
                        Lagi butuh bantuan apa sobat?
                    </h1>
                    <div className="w-full max-w-[360px]">
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
                <PromptBar onSend={onSendMessage} />
            </div>
        </div>
    );
};

export default MainSection;
