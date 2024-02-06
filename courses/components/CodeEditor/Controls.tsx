import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { cn } from 'commons/utils';
import { useCodeEditor } from 'courses/hooks/useCodeEditor';
import React, { MouseEventHandler, useRef } from 'react';
import { BsPlayFill, BsStop } from 'react-icons/bs';
import { MdCloudDone } from 'react-icons/md';
import { SlRefresh } from 'react-icons/sl';
import Skeleton from 'commons/components/elements/Skeleton';
import Spinner from 'commons/components/elements/Spinner';

const SYMBOLS = ['(', ')', ':', '"', "'", '=', '<', '>'];

export default function Controls(): JSX.Element {
    const { checkCustomBreakpoints } = useWindowBreakpoints();
    const { isLoading, isRunning, isAutoSaving, controls } = useCodeEditor();

    if (isLoading)
        return (
            <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto bg-neutral-900 no-scrollbar">
                <Skeleton repeat={6} className="h-8 !mb-0 w-7" />
            </div>
        );

    return (
        <div className="flex items-center px-4 py-3 bg-neutral-900">
            {isAutoSaving ? (
                <Spinner size="small" />
            ) : (
                <MdCloudDone className="mr-4 text-state-success" size={24} />
            )}
            <button
                onClick={controls.reset}
                disabled={isRunning}
                className={cn(
                    isRunning && 'btn-disabled',
                    'btn btn-square btn-sm btn-ghost'
                )}
                title="Reset">
                <SlRefresh size={24} />
            </button>
            <div className="mx-1 divider divider-horizontal"></div>
            <div className="flex flex-1 w-full gap-2 overflow-x-auto no-scrollbar">
                <CodeEditorSymbolButton symbol={`\t`} text="tab" />
                {SYMBOLS.map((symbol) => (
                    <CodeEditorSymbolButton
                        key={`symbol-${symbol}`}
                        symbol={symbol}
                        text={symbol}
                        className="w-7"
                    />
                ))}
            </div>
            <div className="mx-1 divider divider-horizontal"></div>
            <button
                onClick={isRunning ? controls.stop : controls.run}
                className={cn(
                    'font-medium text-white normal-case btn btn-sm bg-accent-purple hover:bg-accent-purple/60',
                    checkCustomBreakpoints(640) && 'btn-square'
                )}>
                <span className="hidden sm:inline">
                    {isRunning ? 'Stop' : 'Run'}
                </span>
                {isRunning ? <BsStop size={20} /> : <BsPlayFill size={20} />}
            </button>
        </div>
    );
}

interface CodeEditorSymbolButtonProps {
    symbol: string;
    text: string;
    className?: string;
}

const CodeEditorSymbolButton = ({
    symbol,
    text,
    className
}: CodeEditorSymbolButtonProps): JSX.Element => {
    const { controls, container } = useCodeEditor();
    const symbolButtonRef = useRef<HTMLButtonElement>(null);

    const handleSymbolButton: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        controls.insertCharacter(symbol);

        if (container) container.focus();
        if (symbolButtonRef.current) symbolButtonRef.current.blur();
    };

    return (
        <button
            ref={symbolButtonRef}
            title={`Insert ${text}`}
            onClick={handleSymbolButton}
            onMouseDown={(e) => e.preventDefault()}
            className={`font-medium text-white btn btn-sm bg-neutral-700 hover:bg-neutral-500 ${className}`}>
            {text}
        </button>
    );
};
