import React, { PropsWithChildren } from 'react';

const MethodListBox = ({
    title,
    icon,
    children
}: PropsWithChildren<{ title: string; icon: JSX.Element }>): JSX.Element => {
    return (
        <div className="w-full p-6 rounded-lg md:p-8 bg-neutral-900">
            <div className="flex items-center mb-4">
                {icon}
                <h3 className="text-base font-bold">{title}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
                {children}
            </div>
        </div>
    );
};

export default MethodListBox;
