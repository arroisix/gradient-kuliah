import { CopilotSolidIcon } from 'commons/components/elements/Icons/CopilotSolidIcon';
import { StarsSolidIcon } from 'commons/components/elements/Icons/StarsSolidIcon';
import { useCopilot } from 'copilot/hooks/useCopilot';
import { useEffect, useState } from 'react';
import { validate } from 'uuid';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { Accordion } from 'radix-ui';
import { ChevronDownIcon } from 'lucide-react';
import { ReasoningIndicator } from 'copilot/components/ReasoningIndicator';
import Link from 'next/link';
import { COPILOT_SUMMARIZER_KEY } from 'dashboard/utils';

function generateMessage(context: string): string {
    return `Berdasarkan data di bawah ini:

    ${context}

    Jelaskan secara singkat, padat, dan jelas hanya dalam satu kalimat.
    `;
}

interface CopilotSummarizerProps {
    context: string;
    chart_type: 'line' | 'bar';
}

function CopilotSummarizer({
    context,
    chart_type
}: CopilotSummarizerProps): JSX.Element {
    const [selectedAccordionItem, setSelectedAccordionItem] = useState('');
    const {
        messages,
        reasoning,
        isLoadingHistory,
        isLoadingResponse,
        currentSessionId,
        setCurrentSessionId,
        handleSendMessage
    } = useCopilot({ withSilentRedirect: false });

    useEffect(() => {
        const sessionId = localStorage.getItem(
            chart_type === 'line'
                ? COPILOT_SUMMARIZER_KEY.LINE_CHART
                : COPILOT_SUMMARIZER_KEY.BAR_CHART
        );

        if (sessionId && validate(sessionId)) {
            setCurrentSessionId(sessionId);
        }
    }, [chart_type, setCurrentSessionId]);

    useEffect(() => {
        if (currentSessionId) {
            localStorage.setItem(
                chart_type === 'line'
                    ? COPILOT_SUMMARIZER_KEY.LINE_CHART
                    : COPILOT_SUMMARIZER_KEY.BAR_CHART,
                currentSessionId
            );
        }
    }, [chart_type, currentSessionId]);

    if (isLoadingHistory) {
        return (
            <div className="animate-pulse h-12 bg-[#333333] rounded-xl"></div>
        );
    }

    if (isLoadingResponse) {
        return (
            <div className="bg-[#20222E] border border-[#282B3C] px-3 py-2 rounded-xl">
                <ReasoningIndicator reasoning={reasoning} mode="single" />
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="bg-[#20222E] border border-[#282B3C] px-3 py-2 rounded-xl flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                    <StarsSolidIcon className="shrink-0 text-[#F2C04C] w-4 h-4" />
                    <p className="text-white text-sm leading-[160%]">
                        Copilot bisa bantu baca posisimu.
                    </p>
                </div>

                <button
                    onClick={() => handleSendMessage(generateMessage(context))}
                    type="button"
                    className="shrink-0 bg-[#5F2BCE] hover:opacity-75 transition-all rounded-full w-8 h-8 grid place-items-center">
                    <CopilotSolidIcon className="text-white w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="h-12">
            <Accordion.Root
                collapsible
                type="single"
                value={selectedAccordionItem}
                onValueChange={(value) => setSelectedAccordionItem(value)}>
                <Accordion.Item
                    value="copilot"
                    className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-[#D790DE] via-[#99B8DA] to-[#439CFB] p-0.5 rounded-xl max-h-[calc(100%-32px)] overflow-hidden flex">
                    <div className="bg-[#20222E] rounded-xl flex-grow overflow-y-scroll scrollbar-none">
                        <Accordion.Header>
                            <Accordion.Trigger className="group flex justify-between items-center gap-2 w-full py-2 px-3">
                                <div className="min-w-0 flex items-center gap-2">
                                    <CopilotSolidIcon className="shrink-0 text-[#B6A6F3] w-4 h-4" />
                                    {selectedAccordionItem === 'copilot' ? (
                                        <></>
                                    ) : (
                                        <p className="text-white text-sm leading-[160%] truncate">
                                            {
                                                messages[messages.length - 1]
                                                    .content
                                            }
                                        </p>
                                    )}
                                </div>

                                <ChevronDownIcon className="shrink-0 text-white group-data-[state=open]:-rotate-180 transition-all w-4 h-4" />
                            </Accordion.Trigger>
                        </Accordion.Header>

                        <Accordion.Content className="space-y-2 px-3 pb-2">
                            <div className="leading-[160%]">
                                <ReactMarkdown
                                    className="inline [&>p]:inline markdown-body after:inline markdown-overflow-break-word markdown-blue-link font-body markdown-img-max-height math-display-overflow text-white text-sm"
                                    remarkPlugins={[remarkMath, remarkGfm]}
                                    rehypePlugins={[rehypeKatex]}>
                                    {messages[messages.length - 1].content}
                                </ReactMarkdown>{' '}
                                <Link
                                    href="/utbk/materi"
                                    className="text-white text-sm font-body underline inline">
                                    Akses materi disini
                                </Link>
                            </div>

                            <button
                                onClick={() =>
                                    handleSendMessage(generateMessage(context))
                                }
                                type="button"
                                className="text-[#B6A6F3] font-semibold text-sm leading-tight py-2 px-3 block ml-auto">
                                Coba Ulang
                            </button>
                        </Accordion.Content>
                    </div>
                </Accordion.Item>
            </Accordion.Root>
        </div>
    );
}

export { CopilotSummarizer };
