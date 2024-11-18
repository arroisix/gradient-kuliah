import PromptBar from './PromptBar';
import ExamplePrompts from './ExamplePrompts';
import ActionButtons from './ActionButtons';

const MainSection = (): JSX.Element => {
    return (
        <div className="flex-1 flex flex-col h-full bg-[#101010] px-4 md:px-8 lg:px-16">
            <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full gap-8">
                <h1 className="text-2xl font-bold text-center">
                    Lagi butuh bantuan apa sobat?
                </h1>

                <ActionButtons />

                <div className="w-full">
                    <p className="text-neutral-400 mb-4">
                        Psst... kamu bisa nanya kayak gini:
                    </p>
                    <ExamplePrompts />
                </div>
            </div>

            <div className="w-full max-w-3xl mx-auto mb-8">
                <PromptBar />
            </div>
        </div>
    );
};

export default MainSection;
