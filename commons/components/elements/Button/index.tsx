/* eslint-disable @typescript-eslint/ban-ts-comment */
import Link from 'next/link';

const BUTTON_THEME: { [key: string]: string } = {
    primary: 'bg-accent-purple rounded-full text-white',
    secondary: 'bg-accent-blue rounded-full text-primary-blue',
    tertiary: 'text-primary-blue',
    disabled: 'bg-neutral-400 text-neutral-300 rounded-full',
    custom: 'rounded-full'
};

const BUTTON_SIZE: { [key: string]: string } = {
    large: 'py-4 px-7',
    normal: 'py-3 px-6',
    small: 'py-2 px-5'
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
    disabled
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

    if (href) {
        return (
            <Link href={href}>
                <div
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
            className={computeVariant()}>
            {children}
        </button>
    );
};

export default Button;
