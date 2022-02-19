type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'custom';

type ButtonSize = 'large' | 'normal' | 'small';

interface BaseButtonProps {
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    href?: string;
    disabled?: boolean;
    children: JSX.Element | string;
    type?: 'button' | 'submit';
    className?: string;
}

interface ButtonProps extends BaseButtonProps {
    variant: ButtonVariant;
    size?: ButtonSize;
}
