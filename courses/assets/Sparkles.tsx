import React from 'react';
import { cn } from 'commons/utils';
import sparkles from './images/sparkles.svg';

const Sparkles = ({
    className
}: React.SVGProps<SVGSVGElement>): JSX.Element => {
    const src = (sparkles as any)?.src ?? (sparkles as any);
    return (
        <span
            aria-hidden="true"
            className={cn(
                'inline-block align-middle bg-[currentColor]',
                className
            )}
            style={{
                WebkitMaskImage: `url(${src})`,
                maskImage: `url(${src})`,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                WebkitMaskSize: 'contain',
                maskSize: 'contain'
            }}
        />
    );
};

export default Sparkles;
