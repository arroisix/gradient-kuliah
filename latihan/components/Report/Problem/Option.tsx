import TiptapViewer from '../../../../courses/components/Textbook/TiptapViewer';
import { IoMdCheckmark as Check, IoMdClose as X } from 'react-icons/io';
import React from 'react';

export const Option = ({
    option,
    isCorrect,
    isSelected
}: {
    option: any;
    isCorrect: boolean;
    isSelected: boolean;
}) => {
    return (
        <div
            className={`flex flex-grow justify-between items-center p-3 my-1 rounded-md w-full max-w-[608px] min-h-[45px] ${
                isSelected || isCorrect
                    ? isCorrect
                        ? 'bg-[#2AC27A]'
                        : 'bg-[#EC5D49]'
                    : 'bg-[#444444]'
            } bg-opacity-50`}>
            <span className="text-sm font-medium">
                <TiptapViewer content={option.text} />
            </span>
            {(isSelected || isCorrect) && (
                <div
                    className={`flex justify-center items-center rounded-md w-[20px] h-[20px] ${
                        isCorrect ? 'bg-[#2AC27A]' : 'bg-[#EC5D49]'
                    }`}>
                    {isCorrect ? (
                        <Check className="text-white" size={16} />
                    ) : (
                        <X className="text-white" size={16} />
                    )}
                </div>
            )}
        </div>
    );
};
