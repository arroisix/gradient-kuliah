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
        <div className="flex flex-col gap-[10px] py-6">
            <select
                onChange={handleSymbolTypeChange}
                name="symbol-type"
                id="symbol-type"
                className="bg-[#20222E] font-bold text-xs text-neutral-400 rounded-[70px] py-2 px-[18px] cursor-pointer border-none focus:outline-none focus:ring-0 focus:appearance-none">
                {SYMBOL_OPTIONS.map((option) => (
                    <option key={option.key} value={option.key}>
                        {option.name}
                    </option>
                ))}
            </select>
            <div className="flex flex-wrap items-center">
                {SYMBOL[symbolType].map(({ display, value }, index) => (
                    <div
                        key={index}
                        className="hover:bg-[#20222E] cursor-pointer py-2 px-4 rounded-lg text-lg"
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
