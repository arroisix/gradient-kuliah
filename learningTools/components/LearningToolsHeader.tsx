import React from 'react';
import { cn } from 'commons/utils';
import KuisIconLarge from 'dashboard/assets/KuisIconLarge';
import FlashcardIcon from 'dashboard/assets/FlashcardIcon';
import { useRouter } from 'next/router';

interface LearningTool {
    name: string;
    is_coming_soon: boolean;
}

interface LearningToolsHeaderProps {
    tools: LearningTool[];
    selectedType: string;
    onTypeChange: (type: 'all' | 'quiz' | 'flashcard') => void;
}

const LearningToolsHeader: React.FC<LearningToolsHeaderProps> = ({
    tools,
    selectedType,
    onTypeChange
}) => {
    const router = useRouter();

    const handleToolClick = (tool: LearningTool) => {
        if (tool.is_coming_soon) return;

        switch (tool.name.toLowerCase()) {
            case 'quiz':
                router.push('/latihan');
                break;
            case 'flashcard':
                router.push('/flashcard');
                break;
            default:
                onTypeChange(tool.name.toLowerCase() as any);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Alat Belajar</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tools.map((tool) => (
                    <button
                        key={tool.name}
                        className={cn(
                            'bg-neutral-900 rounded-xl p-4',
                            'flex flex-col gap-2',
                            'relative',
                            'cursor-pointer hover:bg-opacity-80',
                            { 'opacity-50': tool.is_coming_soon },
                            {
                                'ring-2 ring-purple-500':
                                    selectedType === tool.name.toLowerCase()
                            }
                        )}
                        onClick={() => handleToolClick(tool)}
                        disabled={tool.is_coming_soon}>
                        {tool.is_coming_soon && (
                            <span className="absolute -top-3 -right-1 flex items-center gap-2 py-1 px-3 rounded-md bg-gradient-to-r from-[#741F86] to-[#965084] via-[#A82C56] font-semibold text-sm text-white">
                                Coming Soon
                            </span>
                        )}
                        <div className="flex justify-between items-start">
                            <div className="text-xl">
                                {tool.name === 'Quiz' && <KuisIconLarge />}
                                {tool.name === 'Flashcard' && <FlashcardIcon />}
                                {tool.name === 'Cheatsheet' && '📄'}
                                {tool.name === 'Study Plan' && '⏰'}
                            </div>
                        </div>
                        <h3 className="font-semibold text-white">
                            {tool.name}
                        </h3>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LearningToolsHeader;
