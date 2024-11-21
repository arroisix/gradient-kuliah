import { useState, useRef, KeyboardEvent } from 'react';
import { BsImage, BsArrowUpShort } from 'react-icons/bs';
import { TbSquareRoot } from 'react-icons/tb';
import { ImOmega } from 'react-icons/im';
import { cn } from 'commons/utils';
import MathForm from '../../../komunitas/components/KomunitasForm/MathForm';
import SymbolForm from '../../../komunitas/components/KomunitasForm/SymbolForm';
import useWindowBreakpoints from '../../../commons/hooks/useWindowBreakpoints';

interface PromptBarProps {
    onSend?: (prompt: string) => void;
    isLoading?: boolean;
}

const PromptBar = ({ onSend, isLoading }: PromptBarProps): JSX.Element => {
    const [prompt, setPrompt] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [activeForm, setActiveForm] = useState<'math' | 'symbol' | null>(
        null
    );
    const { isMobileBreakpoints } = useWindowBreakpoints();

    const handleSend = () => {
        if (prompt.trim() && onSend && !isLoading) {
            onSend(prompt);
            setPrompt('');
            setActiveForm(null);
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSymbolClick = (symbol: string) => {
        const input = inputRef.current;
        if (input) {
            const start = input.selectionStart || 0;
            const end = input.selectionEnd || 0;
            const newPrompt =
                prompt.slice(0, start) + symbol + prompt.slice(end);
            setPrompt(newPrompt);
            setTimeout(() => {
                input.setSelectionRange(
                    start + symbol.length,
                    start + symbol.length
                );
                input.focus();
            });
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div
                className={cn(
                    'py-2',
                    !isMobileBreakpoints &&
                        'border-2 border-neutral-800 rounded-xl',
                    isMobileBreakpoints && 'border-t border-neutral-800'
                )}>
                <div className="px-2 pb-3">
                    <input
                        ref={inputRef}
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Lagi butuh bantuan apa sobat?"
                        className="w-full bg-transparent border-none focus:ring-0 outline-none text-white"
                        disabled={isLoading}
                    />
                </div>

                <div className="px-5 pb-4 flex items-center justify-between">
                    <div className="flex gap-2">
                        <button
                            className="text-neutral-400 hover:text-white"
                            disabled={isLoading}>
                            <BsImage size={20} />
                        </button>
                        <button
                            className={cn(
                                'text-neutral-400 hover:text-white p-2 rounded-lg transition-colors',
                                activeForm === 'math' &&
                                    'bg-neutral-800 text-white'
                            )}
                            onClick={() =>
                                setActiveForm(
                                    activeForm === 'math' ? null : 'math'
                                )
                            }
                            disabled={isLoading}>
                            <TbSquareRoot size={20} />
                        </button>
                        <button
                            className={cn(
                                'text-neutral-400 hover:text-white p-2 rounded-lg transition-colors',
                                activeForm === 'symbol' &&
                                    'bg-neutral-800 text-white'
                            )}
                            onClick={() =>
                                setActiveForm(
                                    activeForm === 'symbol' ? null : 'symbol'
                                )
                            }
                            disabled={isLoading}>
                            <ImOmega size={16} />
                        </button>
                    </div>

                    <div className="flex items-center gap-1 pl-2 rounded-full">
                        {/*TODO: Implement Energy*/}
                        {/*<div className="flex items-center gap-0.5 text-sm border-r border-neutral-700 pr-2">*/}
                        {/*    <span className="text-yellow-500">⚡</span>*/}
                        {/*    <span>5</span>*/}
                        {/*</div>*/}
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !prompt.trim()}
                            className={cn(
                                'transition-colors bg-[#5F2BCE] p-1.5 rounded-full',
                                prompt.trim() && !isLoading
                                    ? 'opacity-100 hover:opacity-90'
                                    : 'opacity-50 cursor-not-allowed'
                            )}>
                            <BsArrowUpShort size={24} className="text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {activeForm === 'math' && (
                <div className="bg-[#242424] rounded-lg max-h-[300px] overflow-y-auto">
                    <div className="p-4">
                        <MathForm />
                    </div>
                </div>
            )}

            {activeForm === 'symbol' && (
                <div className="bg-[#242424] rounded-lg max-h-[300px] overflow-y-auto">
                    <div className="p-4">
                        <SymbolForm onClickSymbol={handleSymbolClick} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromptBar;
