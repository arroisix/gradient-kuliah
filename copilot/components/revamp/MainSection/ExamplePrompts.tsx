import { FiArrowUpRight } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { chatApi } from 'copilot/redux/api/copilotApi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useTracker } from 'tracker/tracker';

type ContentType =
    | 'course_video'
    | 'textbook_problem'
    | 'bank_soal_problem'
    | 'astronotes_content'
    | null;

interface ExamplePromptsProps {
    onPromptClick: (prompt: string, imageUrl?: string) => void;
    contentType?: ContentType;
}

const ExamplePrompts = ({
    onPromptClick,
    contentType
}: ExamplePromptsProps): JSX.Element => {
    const [templates, setTemplates] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const tracker = useTracker();

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await chatApi.getTemplates(contentType);
                setTemplates(response.templates);
            } catch (error) {
                console.error('Failed to fetch templates:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTemplates();
    }, [contentType]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-4">
                <AiOutlineLoading3Quarters
                    size={24}
                    className="animate-spin text-neutral-400"
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {templates.map((prompt, index) => (
                <button
                    key={index}
                    onClick={() => {
                        tracker?.genericTrack('Click Message Template', {
                            MESSAGE_CONTENT: prompt
                        });
                        onPromptClick(prompt);
                    }}
                    className="flex items-center justify-between border border-neutral-800 hover:bg-neutral-800/50 px-4 py-3 rounded-lg text-left transition-colors">
                    <span>{prompt}</span>
                    <FiArrowUpRight className="text-neutral-400" />
                </button>
            ))}
        </div>
    );
};

export default ExamplePrompts;
