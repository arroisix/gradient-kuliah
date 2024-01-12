import { MouseEvent, ReactNode } from 'react';

type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'neutral'
    | 'custom';

type ButtonSize = 'large' | 'normal' | 'small' | 'extraSmall';

interface BaseButtonProps {
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    href?: string;
    disabled?: boolean;
    children?: ReactNode;
    type?: 'button' | 'submit';
    className?: string;
    id?: string;
}

interface ButtonProps extends BaseButtonProps {
    variant: ButtonVariant;
    size?: ButtonSize;
    target?: string;
    eventName?: string;
    eventPayload?: Record<string, any>;
    linkClass?: string;
}
