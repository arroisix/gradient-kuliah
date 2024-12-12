import { MainSectionProps } from '../../types/copilot';
import ActionButtons from './ActionButtons';
import ExamplePrompts from './ExamplePrompts';

const MainSection = ({
    onSendMessage,
    onFocusPrompt,
    onImageCapture
}: MainSectionProps): JSX.Element => {
    return (
        <div className="flex-1 flex flex-col h-full bg-[#101010] overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto mt-16 mb-24 md:mt-0 md:mb-0">
                <div className="flex flex-col md:items-center md:justify-center min-h-full max-w-3xl mx-auto w-full gap-4 py-8">
                    <h1 className="text-xl md:text-2xl font-bold text-center">
                        Lagi butuh bantuan apa sobat?
                    </h1>

                    <ActionButtons
                        onFocusPrompt={onFocusPrompt}
                        onImageCapture={onImageCapture}
                    />

                    <div className="w-full md:max-w-[360px]">
                        <p className="text-neutral-400 mb-4">
                            Psst... kamu bisa nanya kayak gini:
                        </p>
                        <ExamplePrompts onPromptClick={onSendMessage} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainSection;
