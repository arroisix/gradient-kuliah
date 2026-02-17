import { useEffect, useState } from 'react';
import { chatApi } from 'copilot/redux/api/copilotApi';
import { useTracker } from 'tracker/tracker';
import { BookOpenIcon } from 'lucide-react';
import { cn } from 'commons/utils';

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
            <div className="flex flex-wrap justify-center gap-3 w-full max-w-[343px] mx-auto">
                <div className="animate-pulse bg-gradient-to-b from-black/10 to-white/10 w-48 h-11 border border-[#333540] rounded-xl"></div>
                <div className="animate-pulse bg-gradient-to-b from-black/10 to-white/10 w-32 h-11 border border-[#333540] rounded-xl"></div>
                <div className="animate-pulse bg-gradient-to-b from-black/10 to-white/10 w-32 h-11 border border-[#333540] rounded-xl"></div>
                <div className="animate-pulse bg-gradient-to-b from-black/10 to-white/10 w-48 h-11 border border-[#333540] rounded-xl"></div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'flex flex-wrap justify-center gap-3 w-full max-w-[343px] mx-auto',
                'md:max-w-[600px]'
            )}>
            {templates.map((prompt, index) => (
                <button
                    key={index}
                    onClick={() => {
                        tracker?.genericTrack('Click Message Template', {
                            MESSAGE_CONTENT: prompt
                        });
                        onPromptClick(prompt);
                    }}
                    className="bg-gradient-to-b from-black/10 to-white/10 border border-[#333540] flex items-center gap-2 py-3 px-4 rounded-xl w-full max-w-[256px] hover:opacity-75 transition-all">
                    <BookOpenIcon className="shrink-0 text-[#B6A6F3] w-5 h-5" />
                    <span className="text-white text-xs text-start">
                        {prompt}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default ExamplePrompts;
