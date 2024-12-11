import { useState, useEffect } from 'react';
import { chatApi } from 'copilot/redux/api/copilotApi';
import { useRouter } from 'next/router';
import { cn } from 'commons/utils';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import CopilotIconFill from '../../assets/CopilotIconFill';

interface SearchSummaryProps {
    onSummaryFetched: (isEmpty: boolean) => void;
}

const SearchSummary = ({
    onSummaryFetched
}: SearchSummaryProps): JSX.Element => {
    const router = useRouter();
    const { q } = router.query;
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const fetchSummary = async () => {
            if (!q) return;

            setIsLoading(true);
            let fullText = '';

            try {
                await chatApi.searchSummary(
                    { input_text: q as string },
                    {
                        onContent: (content) => {
                            fullText += content;
                            setSummary(fullText);
                        },
                        onError: (error) => {
                            console.error('Summary error:', error);
                        }
                    }
                );
            } catch (error) {
                console.error('Failed to fetch summary:', error);
            } finally {
                setIsLoading(false);
                // Notify parent whether the summary is empty or not
                onSummaryFetched(fullText.trim() === '');
            }
        };

        fetchSummary();
    }, [q, onSummaryFetched]);

    const handleCopilotClick = () => {
        router.push('/copilot');
    };

    if (!q) return <></>;

    return (
        <div className="bg-[#1E1930] rounded-2xl px-4 md:px-6 mt-6 py-4 md:py-5">
            <div className="flex justify-between items-start gap-4 mb-2">
                <h2 className="text-lg font-semibold">Rangkuman ✨</h2>
                <button
                    onClick={handleCopilotClick}
                    className="flex items-center gap-2 bg-[#5F2BCE] text-white px-2 py-1 text-sm rounded-full hover:opacity-90 transition-opacity">
                    <CopilotIconFill />
                    <span>Copilot AI</span>
                </button>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center items-center py-4">
                        <AiOutlineLoading3Quarters
                            size={24}
                            className="animate-spin text-neutral-400"
                        />
                    </div>
                ) : (
                    summary && (
                        <>
                            <p
                                className={cn(
                                    'text-base text-gray-200',
                                    !isExpanded && 'line-clamp-3'
                                )}>
                                {summary}
                            </p>

                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="w-full md:w-fit text-sm text-gray-400 hover:text-white transition-colors border border-[#999999] hover:border-white rounded-full px-6 py-2">
                                {isExpanded ? 'Lebih sedikit' : 'Selengkapnya'}
                            </button>
                        </>
                    )
                )}
            </div>
        </div>
    );
};

export default SearchSummary;
