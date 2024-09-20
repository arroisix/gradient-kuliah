import { cn } from 'commons/utils';
import React from 'react';

const FreeBadge = ({ className }: PropsWithClassName): JSX.Element => {
    return (
        <div
            className={cn(
                'text-white border-none badge bg-gradient-to-tr from-[#02EC60] to-[#236D16] font-bold px-3',
                className
            )}>
            Gratis
        </div>
    );
};

export default FreeBadge;
