import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { RiQuestionLine } from 'react-icons/ri';

const DisclosureTutorial = ({ content }: { content: string }): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-[#121212] rounded-lg">
            <div
                className={`flex justify-between items-center gap-2 p-4 cursor-pointer ${
                    isOpen && 'border-b-[1px] border-[#2D2D2D]'
                }`}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-hidden>
                <div className="flex items-center gap-[14px]">
                    <RiQuestionLine size={24} />
                    <span className="inline-block font-extrabold text-sm">
                        Cara Penggunaan Kode Referal
                    </span>
                </div>
                <FiChevronDown
                    size={24}
                    className={`text-neutral-400 ${
                        isOpen ? 'rotate-180' : ''
                    } transition-all`}
                />
            </div>
            <div className={`p-4 ${isOpen ? '' : 'hidden'}`}>
                <ReactMarkdown
                    className="markdown-body-sm markdown-pre-code font-body text-neutral-400"
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    linkTarget={'_blank'}>
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
};

export default DisclosureTutorial;
