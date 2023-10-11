/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cn, onlyText } from 'commons/utils';
import Link from 'next/link';
import { MouseEventHandler } from 'react';
import { useTracker } from 'tracker/tracker';
import { ButtonProps } from './button';

const BUTTON_THEME: { [key: string]: string } = {
    primary: 'bg-accent-purple rounded-full text-white font-body',
    secondary: 'bg-accent-blue rounded-full text-primary-blue font-body',
    tertiary: 'text-primary-blue font-body',
    disabled: 'bg-neutral-400 text-neutral-300 rounded-full font-body',
    custom: 'rounded-full font-body'
};

const BUTTON_SIZE: { [key: string]: string } = {
    large: 'py-4 px-7',
    normal: 'py-2 px-6',
    small: 'py-2 px-5',
    extraSmall: 'py-1 px-5'
};

const Button = ({
    onClick,
    onMouseEnter,
    onMouseLeave,
    href,
    className,
    variant,
    size,
    children,
    type,
    target,
    disabled,
    id,
    eventName,
    eventPayload
}: ButtonProps): JSX.Element => {
    const tracker = useTracker();
    const handleClick: MouseEventHandler<any> = (e) => {
        onClick?.(e);
        if (eventName) {
            tracker?.trackButtonClick(
                eventName,
                onlyText(children),
                eventPayload
            );
        }
    };

    const computeVariant = (): string => {
        const styling = 'font-bold cursor-pointer';
        return cn(
            styling,
            className,
            disabled ? BUTTON_THEME['disabled'] : BUTTON_THEME[variant],
            size ? BUTTON_SIZE[size] : BUTTON_SIZE['normal']
        );
    };

    if (target) {
        return (
            <a
                href={href}
                target={target}
                id={id}
                onClick={handleClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className={cn('block', computeVariant())}>
                {children}
            </a>
        );
    }

    if (href) {
        return (
            <Link href={href}>
                <div
                    id={id}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    className={computeVariant()}>
                    {children}
                </div>
            </Link>
        );
    }

    return (
        <button
            type={type}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={handleClick}
            disabled={disabled}
            id={id}
            className={computeVariant()}>
            {children}
        </button>
    );
};

export default Button;
