import Button from 'commons/components/elements/Button';
import { cn } from 'commons/utils';
import React from 'react';

const NavMenuLink = ({
    enabled,
    href,
    label,
    lightMode,
    tooltip
}: NavLink & { lightMode?: boolean }): JSX.Element => {
    return enabled ?? true ? (
        <Button
            href={href}
            variant="custom"
            className={cn(
                '!p-0 font-body font-normal text-xs text-neutral-400',
                lightMode ? 'hover:text-black' : 'hover:text-white',
                tooltip && 'tooltip tooltip-right'
            )}
            data-tip={tooltip}>
            {label}
        </Button>
    ) : (
        <></>
    );
};

export default NavMenuLink;
