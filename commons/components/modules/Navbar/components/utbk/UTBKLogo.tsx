import { cn } from 'commons/utils';

function UTBKLogo({
    variant = 'large'
}: {
    variant?: 'small' | 'large';
}): JSX.Element {
    return (
        <div className="rounded-full p-0.5 bg-gradient-to-tr from-[#F6EDFE] via-[#998DEB] to-[#604DBD]">
            <div
                className={cn(
                    'rounded-full relative flex justify-center items-center bg-gradient-to-br from-[#32257C] via-[#4442B1] to-[#5F6BDF]',
                    variant === 'small'
                        ? 'w-[52px] h-[18px]'
                        : 'w-[52px] h-[18px] lg:w-[71px] lg:h-[24px] '
                )}>
                <span
                    className={cn(
                        'text-white font-bold tracking-wider text-center',
                        variant === 'small' ? 'text-sm' : 'text-sm lg:text-base'
                    )}>
                    UTBK
                </span>
            </div>
        </div>
    );
}

export default UTBKLogo;
