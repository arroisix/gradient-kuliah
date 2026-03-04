import { CopilotSolidIcon } from 'commons/components/elements/Icons/CopilotSolidIcon';
import { useCopilot } from 'copilot/hooks/useCopilot';
import { useEffect, useState } from 'react';
import { validate } from 'uuid';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { Accordion } from 'radix-ui';
import { ChevronDownIcon } from 'lucide-react';
import Link from 'next/link';
import { useLottie } from 'lottie-react';
import copilotAnimation from 'copilot/data/copilot-animation.json';
import { ReasoningIndicator } from 'copilot/components/ReasoningIndicator';

function generateMessage(context: string): string {
    return `Berdasarkan data di bawah ini:

    ${context}

    Jelaskan secara singkat, padat, dan jelas hanya dalam satu kalimat.
    `;
}

function CopilotIconLoading(): JSX.Element {
    const { View: CopilotAnimation } = useLottie({
        animationData: copilotAnimation,
        loop: true
    });

    return <div className="shrink-0 w-6 h-6">{CopilotAnimation}</div>;
}

interface CopilotSummarizerProps {
    context: string;
}

function CopilotSummarizer({ context }: CopilotSummarizerProps): JSX.Element {
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
        const sessionId = localStorage.getItem('spider_chart:copilot');
        if (sessionId && validate(sessionId)) {
            setCurrentSessionId(sessionId);
        }
    }, [setCurrentSessionId]);

    useEffect(() => {
        if (currentSessionId) {
            localStorage.setItem('spider_chart:copilot', currentSessionId);
        }
    }, [currentSessionId]);

    if (isLoadingHistory) {
        return (
            <div className="animate-pulse w-6 h-6 bg-[#333333] rounded-full"></div>
        );
    }

    if (isLoadingResponse) {
        return (
            <div className="h-6">
                <Accordion.Root
                    collapsible
                    type="single"
                    value={selectedAccordionItem}
                    onValueChange={(value) => setSelectedAccordionItem(value)}>
                    <Accordion.Item
                        value="copilot"
                        className={
                            selectedAccordionItem === 'copilot'
                                ? 'absolute top-4 left-4 right-4 bg-[#20222E] rounded-xl py-2 px-3'
                                : ''
                        }>
                        <Accordion.Header>
                            {selectedAccordionItem === 'copilot' ? (
                                <></>
                            ) : (
                                <Accordion.Trigger type="button">
                                    <CopilotIconLoading />
                                </Accordion.Trigger>
                            )}
                        </Accordion.Header>

                        <Accordion.Content className="flex justify-between items-center">
                            <ReasoningIndicator
                                reasoning={reasoning}
                                mode="single"
                            />

                            <button
                                type="button"
                                onClick={() => setSelectedAccordionItem('')}>
                                <ChevronDownIcon className="shrink-0 text-white -rotate-180 transition-all w-4 h-4" />
                            </button>
                        </Accordion.Content>
                    </Accordion.Item>
                </Accordion.Root>
            </div>
        );
    }

    if (messages.length > 0) {
        return (
            <div className="h-6">
                <Accordion.Root
                    collapsible
                    type="single"
                    value={selectedAccordionItem}
                    onValueChange={(value) => setSelectedAccordionItem(value)}>
                    <Accordion.Item
                        value="copilot"
                        className={
                            selectedAccordionItem === 'copilot'
                                ? 'absolute top-4 left-4 right-4 bg-gradient-to-r from-[#D790DE] via-[#99B8DA] to-[#439CFB] p-0.5 rounded-xl'
                                : ''
                        }>
                        <div
                            className={
                                selectedAccordionItem === 'copilot'
                                    ? 'bg-[#20222E] rounded-xl'
                                    : ''
                            }>
                            <Accordion.Header>
                                {selectedAccordionItem === 'copilot' ? (
                                    <Accordion.Trigger
                                        type="button"
                                        className="group flex justify-between items-center gap-2 w-full py-2 px-3">
                                        <div className="min-w-0 flex items-center gap-2">
                                            <CopilotSolidIcon className="shrink-0 text-[#B6A6F3] w-4 h-4" />
                                            {selectedAccordionItem ===
                                            'copilot' ? (
                                                <></>
                                            ) : (
                                                <p className="text-white text-sm leading-[160%] truncate">
                                                    {
                                                        messages[
                                                            messages.length - 1
                                                        ].content
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <ChevronDownIcon className="shrink-0 text-white group-data-[state=open]:-rotate-180 transition-all w-4 h-4" />
                                    </Accordion.Trigger>
                                ) : (
                                    <Accordion.Trigger
                                        type="button"
                                        className="bg-gradient-to-r from-[#D790DE] via-[#99B8DA] to-[#439CFB] p-0.5 rounded-full">
                                        <div className="bg-[#191920] rounded-full p-0.5">
                                            <CopilotSolidIcon className="text-[#B6A6F3] w-4 h-4" />
                                        </div>
                                    </Accordion.Trigger>
                                )}
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
                                        handleSendMessage(
                                            generateMessage(context)
                                        )
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

    return (
        <button
            onClick={() => handleSendMessage(generateMessage(context))}
            type="button"
            className="p-1">
            <CopilotSolidIcon className="text-[#B6A6F3] w-4 h-4" />
        </button>
    );
}

export { CopilotSummarizer };
