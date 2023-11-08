import { cn } from 'commons/utils';
import React, { PropsWithChildren } from 'react';

const Container = ({
    children,
    className
}: PropsWithClassName & PropsWithChildren): JSX.Element => {
    return (
        <section
            className={cn(
                'w-full max-w-screen-xl mx-auto px-4 lg:px-20',
                className
            )}>
            {children}
        </section>
    );
};

export default Container;
