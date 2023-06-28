import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import TextareaAutosize from 'react-textarea-autosize';
import { ChangeEvent, useRef, useState } from 'react';
import Button from 'commons/components/elements/Button';
import { MATH_NOTATION } from './constant';

const MathForm = ({
    setFormContent
}: {
    setFormContent: React.Dispatch<React.SetStateAction<string>>;
}): JSX.Element => {
    const [mathContent, setMathContent] = useState('');

    const mathTextareaRef = useRef<HTMLTextAreaElement>(null);

    function handleClickTextArea(
        event: React.MouseEvent<HTMLTextAreaElement, MouseEvent>
    ): void {
        console.log(event.currentTarget.selectionStart);
    }

    function handleMathContent(event: ChangeEvent<HTMLTextAreaElement>): void {
        setMathContent(event.target.value);
    }

    function handleAddMathContent(): void {
        setFormContent(
            (prev) =>
                prev +
                `${
                    mathContent.includes('\n')
                        ? `\n$$\n${mathContent.replaceAll('\n', '\n\n')}\n$$\n`
                        : `$${mathContent.replaceAll('\n', '\n\n')}$ `
                }`
        );
        setMathContent('');
    }

    function handleInsertMathTextarea(latex: string): void {
        const cursorPosition = mathTextareaRef.current
            ?.selectionStart as number;
        const textBeforeCursorPosition = mathContent.substring(
            0,
            cursorPosition
        );
        const textAfterCursorPosition = mathContent.substring(
            cursorPosition,
            mathContent.length
        );
        setMathContent(
            `${textBeforeCursorPosition} ${latex} ${textAfterCursorPosition}`
        );
    }

    return (
        <div className="flex flex-col gap-[10px] py-6">
            <ReactMarkdown
                className={`text-xs border-[1px] border-[#373737] p-[10px] rounded-[4px] min-h-[54px] ${
                    mathContent ? '' : 'text-neutral-600'
                }`}
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}>
                {!mathContent
                    ? `Pratinjau`
                    : mathContent.includes('\n')
                    ? `$$\n${mathContent.replaceAll('\n', '\n\n')}\n$$`
                    : `$${mathContent.replaceAll('\n', '\n\n')}$`}
            </ReactMarkdown>
            <div className="flex flex-wrap justify-around items-center">
                {MATH_NOTATION.map(({ display, latex }, index) => (
                    <div
                        key={index}
                        className="hover:bg-[#2C2C2C] p-2 rounded-lg text-xs"
                        onClick={() => handleInsertMathTextarea(latex)}
                        aria-hidden>
                        <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}>
                            {`$${display}$`}
                        </ReactMarkdown>
                    </div>
                ))}
            </div>
            <div className="border-[1px] border-[#373737] rounded-[4px]">
                <TextareaAutosize
                    ref={mathTextareaRef}
                    value={mathContent}
                    name="form"
                    onChange={handleMathContent}
                    onClick={handleClickTextArea}
                    className="w-full bg-transparent text-xs p-[10px] border-none focus:outline-none focus:ring-0 focus:appearance-none"
                />
                <div className="flex gap-2 justify-end p-[10px] pt-0">
                    <Button
                        variant="custom"
                        className="text-neutral-600 font-extrabold text-xs px-[10px] py-[5px]">
                        Batal
                    </Button>
                    <Button
                        variant="custom"
                        className="!font-semibold text-xs px-[12px] py-[5px] bg-[#373737]"
                        onClick={handleAddMathContent}>
                        Sisipkan
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MathForm;
