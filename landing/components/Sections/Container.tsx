import { cn } from 'commons/utils';
import React, { HtmlHTMLAttributes } from 'react';

const Container = ({
    id,
    children,
    className
}: HtmlHTMLAttributes<HTMLDivElement>): JSX.Element => {
    return (
        <section
            id={id}
            className={cn(
                'w-full max-w-screen-xl mx-auto px-4 md:px-8 lg:px-20',
                className
            )}>
            {children}
        </section>
    );
};

export default Container;
