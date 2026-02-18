import { formatCurrency } from 'commons/utils';
import { SparklesIcon, Check } from 'lucide-react';
import Button from './elements/Button';
import React from 'react';

interface Props {
    credit?: string | number;
    isLoading: boolean;
    selectedAmount: number;
    setSelectedAmount: (v: number) => void;
    onBuy: () => void;
    title?: string;
}

const CreditPicker = ({
    credit,
    isLoading,
    selectedAmount,
    setSelectedAmount,
    onBuy,
    title = 'Pilih Credit Balance'
}: Props) => {
    return (
        <>
            <div className="flex items-center gap-2 absolute top-4 left-4">
                <h3 className="text-white font-semibold text-sm">{title}</h3>
            </div>
            <div className="flex flex-col gap-3 pt-3">
                <div className="flex flex-col items-start gap-2">
                    <div className="text-sm text-neutral-300">
                        Sisa credit kamu :{' '}
                        <span className="text-white font-semibold">
                            {isLoading || !credit
                                ? '—'
                                : formatCurrency(credit as string)
                                      .slice(2)
                                      .split(',')[0]}{' '}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {[10000, 50000, 100000].map((amt) => {
                        const selected = selectedAmount === amt;
                        return (
                            <button
                                key={amt}
                                onClick={() => setSelectedAmount(amt)}
                                className={
                                    'w-full flex items-center justify-between p-3 rounded-lg cursor-pointer ' +
                                    (selected
                                        ? 'bg-[#6E33D6] text-white'
                                        : 'bg-[#181818] text-white')
                                }>
                                <div className="flex items-center gap-3">
                                    <div
                                        className={
                                            'w-6 h-6 flex items-center justify-center rounded-full ' +
                                            (selected
                                                ? 'bg-white'
                                                : 'border border-neutral-600')
                                        }>
                                        {selected ? (
                                            <Check
                                                size={14}
                                                className="text-[#6E33D6]"
                                            />
                                        ) : null}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <SparklesIcon
                                            size={16}
                                            color="#E48E0D"
                                            fill="#E48E0D"
                                        />
                                        <span className="font-semibold">
                                            {amt.toLocaleString('id')}
                                        </span>
                                    </div>
                                </div>

                                <div
                                    className={
                                        selected
                                            ? 'text-white font-semibold'
                                            : 'text-neutral-300'
                                    }>
                                    Rp{amt.toLocaleString('id')}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="pt-2">
                    <Button
                        onClick={onBuy}
                        variant="primary"
                        className="w-full bg-[#6E33D6] border-none hover:bg-[#5a26b8]">
                        Beli {selectedAmount.toLocaleString('id')} Credit
                    </Button>
                </div>
            </div>
        </>
    );
};

export default CreditPicker;
