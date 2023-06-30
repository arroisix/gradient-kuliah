import { useState } from 'react';
import { SYMBOL } from './constant';

const SYMBOL_OPTIONS = [
    { key: 'matematika', name: 'Simbol: Matematika' },
    { key: 'supersub', name: 'Simbol: Superskrip dan subskrip' },
    { key: 'sirilik', name: 'Simbol Bahasa: Sirilik' },
    { key: 'yunani', name: 'Simbol Bahasa: Yunani' },
    { key: 'eropa', name: 'Simbol Bahasa: Eropa' },
    { key: 'lainnya', name: 'Simbol lain' }
];

const SymbolForm = ({
    setFormContent,
    formRef
}: {
    setFormContent: React.Dispatch<React.SetStateAction<string>>;
    formRef: React.RefObject<HTMLTextAreaElement>;
}): JSX.Element => {
    const [symbolType, setSymbolType] = useState<
        'matematika' | 'supersub' | 'sirilik' | 'yunani' | 'eropa' | 'lainnya'
    >('matematika');

    function handleSymbolTypeChange(
        event: React.ChangeEvent<HTMLSelectElement>
    ): void {
        setSymbolType(
            event.target.value as
                | 'matematika'
                | 'supersub'
                | 'sirilik'
                | 'yunani'
                | 'eropa'
                | 'lainnya'
        );
    }

    function handleInsertSymbol(symbol: string): void {
        const cursorPosition = formRef.current?.selectionStart as number;
        const textBeforeCursorPosition = formRef.current?.value.substring(
            0,
            cursorPosition
        );
        const textAfterCursorPosition = formRef.current?.value.substring(
            cursorPosition,
            formRef.current?.value.length
        );
        setFormContent(
            `${textBeforeCursorPosition} ${symbol} ${textAfterCursorPosition}`
        );
    }

    return (
        <div className="flex flex-col gap-[10px] py-6">
            <select
                onChange={handleSymbolTypeChange}
                name="symbol-type"
                id="symbol-type"
                className="bg-[#2C2C2C] font-bold text-xs text-neutral-400 rounded-[70px] py-2 px-[18px] cursor-pointer border-none focus:outline-none focus:ring-0 focus:appearance-none">
                {SYMBOL_OPTIONS.map((option) => (
                    <option key={option.key} value={option.key}>
                        {option.name}
                    </option>
                ))}
            </select>
            <div className="flex flex-wrap justify-around items-center">
                {SYMBOL[symbolType].map(({ display, value }, index) => (
                    <div
                        key={index}
                        className="hover:bg-[#2C2C2C] cursor-pointer py-2 px-4 rounded-lg text-lg"
                        onClick={() => handleInsertSymbol(value)}
                        aria-hidden>
                        {display}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SymbolForm;
