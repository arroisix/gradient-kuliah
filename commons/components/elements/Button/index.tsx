/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cn, onlyText } from 'commons/utils';
import Link from 'next/link';
import { MouseEventHandler } from 'react';
import { useTracker } from 'tracker/tracker';
import { ButtonProps } from './button';

const BUTTON_THEME: { [key: string]: string } = {
    primary:
        'bg-accent-purple rounded-full text-white font-body hover:bg-accent-purple/60',
    secondary:
        'bg-graphite-800 rounded-full text-white font-body hover:bg-neutral-700',
    tertiary: 'text-[#B6A6F3] font-semibold hover:bg-graphite-900 rounded',
    neutral: 'bg-neutral-700 rounded-full text-white',
    disabledPrimary:
        'bg-accent-purple/50 text-white/50 rounded-full font-body cursor-not-allowed',
    disabled:
        'bg-neutral-700/80 text-neutral-300/30 rounded-full font-body cursor-not-allowed',
    custom: 'rounded-full font-body'
};

const BUTTON_SIZE: { [key: string]: string } = {
    large: 'py-4 px-7',
    normal: 'py-2 px-6',
    small: 'py-2 px-5',
    extraSmall: 'py-1 px-5 text-sm'
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
    eventPayload,
    linkClass
}: ButtonProps): JSX.Element => {
    const tracker = useTracker();
    const handleClick: MouseEventHandler<any> = (e) => {
        onClick?.(e);
        if (eventName) {
            console.log('track');
            tracker?.trackButtonClick(
                eventName,
                onlyText(children),
                eventPayload
            );
        }
    };

    const computeVariant = (): string => {
        const styling = 'font-bold cursor-pointer transition';
        return cn(
            styling,
            className,
            disabled
                ? variant === 'primary'
                    ? BUTTON_THEME['disabledPrimary']
                    : BUTTON_THEME['disabled']
                : BUTTON_THEME[variant],
            size ? BUTTON_SIZE[size] : BUTTON_SIZE['normal']
        );
    };

    if (target) {
        return (
            <a
                href={href as string}
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
            <Link
                href={disabled ? '#' : (href as string)}
                className={linkClass}
                onClick={disabled ? undefined : handleClick}>
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
