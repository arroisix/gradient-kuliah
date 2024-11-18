import { useState } from 'react';
import { BsImage } from 'react-icons/bs';
import { IoSend } from 'react-icons/io5';
import { TbSquareRoot } from 'react-icons/tb';
import { cn } from 'commons/utils';

const PromptBar = (): JSX.Element => {
    const [prompt, setPrompt] = useState('');

    return (
        <div className="border-2 border-neutral-800 rounded-xl py-2">
            <div className="px-2 pb-3">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Lagi butuh bantuan apa sobat?"
                    className="w-full bg-transparent border-none focus:ring-0 outline-none text-white"
                />
            </div>

            <div className="px-5 pb-4 flex items-center justify-between">
                <div className="flex gap-2">
                    <button className="text-neutral-400 hover:text-white">
                        <BsImage size={20} />
                    </button>
                    <button className="text-neutral-400 hover:text-white">
                        <TbSquareRoot size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm">
                        <span className="text-yellow-500">⚡</span>
                        <span>5</span>
                    </div>
                    <button
                        className={cn(
                            'ml-2 transition-colors',
                            prompt.length > 0
                                ? 'text-purple-500 hover:text-purple-400'
                                : 'text-neutral-400'
                        )}>
                        <IoSend size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromptBar;
