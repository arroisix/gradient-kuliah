import { cn } from 'commons/utils';
import React from 'react';
import { BsCheck } from 'react-icons/bs';

export const CorrectAnswerBadge = ({
    isMulti = false,
    isCorrect = false
}): JSX.Element => {
    return (
        <div
            className={cn(
                isCorrect
                    ? 'grid w-6 h-6 text-white border border-white place-items-center bg-state-success'
                    : 'hidden',
                isMulti ? 'rounded' : 'rounded-full'
            )}>
            <BsCheck size={20} />
        </div>
    );
};
