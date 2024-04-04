import { cn } from 'commons/utils';
import React from 'react';
import { FaTrash } from 'react-icons/fa';

type ClassActionItem = {
    slug: string;
    name: string;
    setDeleting: React.Dispatch<React.SetStateAction<string[]>>;
};

const ClassActionItem = ({
    slug,
    name,
    setDeleting
}: ClassActionItem): JSX.Element => {
    return (
        <div
            key={slug}
            className={cn(
                'flex justify-between items-center px-4 py-2 rounded-lg bg-neutral-800 z-[6] relative has-[input:checked]:hidden'
            )}>
            <span className="font-bold ">{name}</span>
            <label className="btn btn-ghost btn-square text-state-error btn-sm">
                <input
                    type="checkbox"
                    className="hidden"
                    onChange={() => setDeleting((prev) => [...prev, slug])}
                    name="deleting"
                />
                <FaTrash size={16} />
            </label>
        </div>
    );
};

export default ClassActionItem;
