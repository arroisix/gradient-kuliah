import PromptBar from './PromptBar';
import ExamplePrompts from './ExamplePrompts';
import ActionButtons from './ActionButtons';
import { MainSectionProps } from '../../types/copilot';

const MainSection = ({ onSendMessage }: MainSectionProps): JSX.Element => {
    return (
        <div className="flex-1 flex flex-col h-full bg-[#101010] px-4 md:px-8 lg:px-16 overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="flex flex-col items-center justify-center min-h-full max-w-3xl mx-auto w-full gap-8 py-8">
                    <h1 className="text-2xl font-bold text-center">
                        Lagi butuh bantuan apa sobat?
                    </h1>

                    <ActionButtons />

                    <div className="w-full">
                        <p className="text-neutral-400 mb-4">
                            Psst... kamu bisa nanya kayak gini:
                        </p>
                        <ExamplePrompts onPromptClick={onSendMessage} />
                    </div>
                </div>
            </div>

            <div className="flex-shrink-0 w-full max-w-3xl mx-auto mb-16">
                <PromptBar onSend={onSendMessage} />
            </div>
        </div>
    );
};

export default MainSection;
