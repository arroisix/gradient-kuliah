import { useState } from 'react';
import { SYMBOL } from './constant';

const SYMBOL_OPTIONS = [
    { key: 'math', name: 'Simbol: Matematika' },
    { key: 'supersub', name: 'Simbol: Superskrip dan subskrip' },
    { key: 'cyrillic', name: 'Simbol Bahasa: Sirilik' },
    { key: 'greece', name: 'Simbol Bahasa: Yunani' },
    { key: 'europe', name: 'Simbol Bahasa: Eropa' },
    { key: 'other', name: 'Simbol lain' }
];

type SymbolOption =
    | 'math'
    | 'supersub'
    | 'cyrillic'
    | 'greece'
    | 'europe'
    | 'other';

const SymbolForm = ({
    onClickSymbol
}: {
    onClickSymbol: (symbol: string) => void;
}): JSX.Element => {
    const [symbolType, setSymbolType] = useState<SymbolOption>('math');

    function handleSymbolTypeChange(
        event: React.ChangeEvent<HTMLSelectElement>
    ): void {
        setSymbolType(event.target.value as SymbolOption);
    }

    return (
        <div className="w-full max-w-lg mx-auto space-y-6">
            <select
                onChange={handleSymbolTypeChange}
                name="symbol-type"
                id="symbol-type"
                className="bg-[#282B3C] text-white font-semibold text-xs border-none rounded-full cursor-pointer focus:ring-0 w-full md:max-w-[256px]">
                {SYMBOL_OPTIONS.map((option) => (
                    <option key={option.key} value={option.key}>
                        {option.name}
                    </option>
                ))}
            </select>

            <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3">
                {SYMBOL[symbolType].map(({ display, value }, index) => (
                    <div
                        key={index}
                        className="hover:bg-[#282B3C] transition-colors cursor-pointer rounded-full w-10 h-10 grid place-items-center text-2xl"
                        onClick={() => onClickSymbol(value)}
                        aria-hidden>
                        {display}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SymbolForm;
