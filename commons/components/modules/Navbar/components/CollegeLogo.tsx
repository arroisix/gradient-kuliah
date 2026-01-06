import { cn } from 'commons/utils';

function CollegeLogo({
    variant = 'large'
}: {
    variant?: 'small' | 'large';
}): JSX.Element {
    return (
        <div className="rounded-full p-0.5 bg-gradient-to-r from-[#5F2BCE] to-[#B6A6F3]">
            <div
                className={cn(
                    'rounded-full relative flex justify-center items-center bg-gradient-to-br from-[#5F2BCE] to-[#8A38F5]',
                    variant === 'small'
                        ? 'w-[52px] h-[18px]'
                        : 'w-[52px] h-[18px] lg:w-[71px] lg:h-[24px] '
                )}>
                <span
                    className={cn(
                        'text-white font-bold tracking-wider text-center',
                        variant === 'small' ? 'text-xs' : 'text-xs lg:text-base'
                    )}>
                    Kuliah
                </span>
            </div>
        </div>
    );
}

export default CollegeLogo;
