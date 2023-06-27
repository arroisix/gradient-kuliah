/* eslint-disable @typescript-eslint/ban-ts-comment */
import Link from 'next/link';

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
    id
}: ButtonProps): JSX.Element => {
    const computeVariant = (): string => {
        let styling = 'font-bold cursor-pointer';

        if (disabled) {
            styling += ` ${BUTTON_THEME['disabled']}`;
        } else {
            styling += ` ${BUTTON_THEME[variant]}`;
        }

        if (size) {
            styling += ` ${BUTTON_SIZE[size]}`;
        } else {
            styling += ` ${BUTTON_SIZE['normal']}`;
        }

        return `${styling} ${className}`;
    };

    if (target) {
        return (
            <a href={href} target={target} id={id}>
                <div
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    className={computeVariant()}>
                    {children}
                </div>
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
            onClick={onClick}
            disabled={disabled}
            id={id}
            className={computeVariant()}>
            {children}
        </button>
    );
};

export default Button;
