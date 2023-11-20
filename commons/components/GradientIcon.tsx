import { cn } from 'commons/utils';
import React from 'react';

const GradientIcon = ({ className }: PropsWithClassName): JSX.Element => {
    return (
        <div
            className={cn(
                'flex-none font-bold font-[Urbanist] bg-black btn-circle btn-sm grid place-items-center select-none text-2xl',
                className
            )}>
            G
        </div>
    );
};

export default GradientIcon;
