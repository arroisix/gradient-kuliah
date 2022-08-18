import { useState } from 'react';
import Button from '.';
import { AiOutlineArrowRight } from 'react-icons/ai';

const EffectButton = ({
    onClick,
    children,
    className,
    href
}: BaseButtonProps): JSX.Element => {
    const [hover, setHover] = useState(false);

    return (
        <Button
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={onClick}
            href={href}
            variant="custom"
            className={`${className} transition ease-in hover:shadow-glowing hover:bg-gradient-to-r hover:from-accent-purple hover:to-[#B73E32] hover:scale-x-110`}>
            <div className="flex w-full items-center">
                {children}
                {hover && (
                    <AiOutlineArrowRight className="transition-all duration-500 ml-4 text-2xl" />
                )}
            </div>
        </Button>
    );
};

export default EffectButton;
