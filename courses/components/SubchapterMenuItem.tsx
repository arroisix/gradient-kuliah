import { cn, formatDuration } from 'commons/utils';
import { CircleIcon, InfoIcon, LucideProps, VideoIcon } from 'lucide-react';
import Link from 'next/link';
import {
    ComponentPropsWithoutRef,
    ForwardRefExoticComponent,
    MouseEvent,
    RefAttributes,
    useMemo
} from 'react';
import { FaLock } from 'react-icons/fa';
import { FaCircleCheck } from 'react-icons/fa6';

interface SubchapterMenuItemProps extends ComponentPropsWithoutRef<'a'> {
    name: string | undefined;
    duration: string | undefined;
    type: 'video' | 'article' | 'quiz' | 'exercise' | undefined;
    isActive?: boolean;
    isFinished?: boolean | null | undefined;
    isDisabled?: boolean;
}

function SubchapterMenuItem({
    name,
    duration,
    type,
    href = '',
    isActive = false,
    isFinished = false,
    isDisabled = false,
    ...props
}: SubchapterMenuItemProps): JSX.Element {
    const bgColor = useMemo(() => {
        let bgColor = '';
        if (isActive) {
            bgColor = cn(bgColor, 'bg-[#36236A] hover:bg-[#363488]');
        } else if (isFinished) {
            bgColor = cn(bgColor, 'bg-[#999999]/10 hover:bg-[#03AC5C]/60');
        } else {
            bgColor = cn(bgColor, 'bg-transparent hover:bg-[#2C2C2C]');
        }
        return bgColor;
    }, [isActive, isFinished]);

    const LeftIcon = useMemo((): ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    > => {
        let Icon = VideoIcon;
        switch (type) {
            case 'article':
                break;
            case 'quiz':
                break;
            case 'exercise':
                break;
            default:
                if (isActive) {
                    Icon = VideoIcon;
                } else {
                    Icon = InfoIcon;
                }
                break;
        }
        return Icon;
    }, [isActive, type]);

    return (
        <Link
            onClick={(event: MouseEvent<HTMLAnchorElement>) =>
                isDisabled && event.preventDefault()
            }
            href={href}
            className={`${bgColor} ${
                isDisabled ? 'cursor-not-allowed' : ''
            } p-3 rounded-lg flex justify-between items-center gap-4 transition-all duration-300`}
            {...props}>
            {isDisabled ? (
                <FaLock className="fill-#666666 w-4 h-4" />
            ) : (
                <LeftIcon
                    className={`${
                        isActive && type === 'video'
                            ? 'text-[#B6A6F3]'
                            : 'text-white'
                    } w-4 h-4 shrink-0`}
                />
            )}

            <div className="w-full space-y-1">
                <p
                    className={`${isActive ? 'font-semibold' : 'font-normal'} ${
                        isDisabled ? 'text-[#666666]' : 'text-white'
                    } text-sm w-full`}>
                    {name}
                </p>

                {type === 'video' ? (
                    <span
                        className={`${
                            (isActive || isFinished) && !isDisabled
                                ? 'text-[#DEDEDE]'
                                : 'text-[#999999]'
                        } text-sm`}>
                        {formatDuration(duration)}
                    </span>
                ) : (
                    <></>
                )}
            </div>

            {isFinished ? (
                <FaCircleCheck
                    className={`${
                        isActive ? 'text-white' : 'text-[#03AC5C]'
                    } w-4 h-4 shrink-0`}
                />
            ) : (
                <CircleIcon
                    className={`${
                        isDisabled ? 'text-[#666666]' : 'text-white'
                    } w-4 h-4 shrink-0`}
                />
            )}
        </Link>
    );
}

export { SubchapterMenuItem };
