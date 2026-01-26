import { cn, formatDuration } from 'commons/utils';
import { useVideoTranscriptContext } from 'courses/contexts/VideoTranscriptProvider';
import {
    BookOpenIcon,
    CircleIcon,
    LucideProps,
    VideoIcon,
    BadgeQuestionMarkIcon
} from 'lucide-react';
import Link from 'next/link';
import {
    ComponentPropsWithoutRef,
    Dispatch,
    ForwardRefExoticComponent,
    RefAttributes,
    SetStateAction,
    useMemo
} from 'react';
import { FaLock } from 'react-icons/fa';
import { FaCircleCheck } from 'react-icons/fa6';

interface SubchapterMenuItemProps extends ComponentPropsWithoutRef<'a'> {
    name: string | undefined;
    duration: string | undefined;
    type: SubChapter['type_name'] | 'video';
    isActive?: boolean;
    isFinished?: boolean | null | undefined;
    isDisabled?: boolean;
    setIsModalSheetOpen?: Dispatch<SetStateAction<boolean>>;
}

function SubchapterMenuItem({
    name,
    duration,
    type,
    href = '',
    isActive = false,
    isFinished = false,
    isDisabled = false,
    setIsModalSheetOpen,
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
    > | null => {
        let Icon = null;
        switch (type) {
            case 'exercise':
                Icon = BadgeQuestionMarkIcon;
                break;
            case 'notebook':
                Icon = BookOpenIcon;
                break;
            default:
                if (!isActive) {
                    Icon = VideoIcon;
                }
                break;
        }
        return Icon;
    }, [isActive, type]);

    return (
        <Link
            onClick={() => setIsModalSheetOpen && setIsModalSheetOpen(false)}
            href={href}
            className={`${bgColor} p-3 min-h-[72px] rounded-lg flex justify-between items-center gap-4 transition-all duration-300`}
            {...props}>
            {isDisabled ? (
                <FaLock className="fill-[#666666] w-4 h-4" />
            ) : LeftIcon ? (
                <LeftIcon className="text-white w-4 h-4 shrink-0" />
            ) : (
                <VideoIndicator />
            )}

            <div className="w-full space-y-1">
                <p
                    className={`${isActive ? 'font-semibold' : 'font-normal'} ${
                        isDisabled ? 'text-[#666666]' : 'text-white'
                    } text-sm w-full`}>
                    {name}
                </p>

                {type === 'lecture' ? (
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

function VideoIndicator(): JSX.Element {
    const { isPlaying } = useVideoTranscriptContext();

    return (
        <div
            className={`${
                isPlaying ? 'items-center' : 'items-end'
            } flex justify-center gap-0.5`}>
            <div
                className={`${
                    isPlaying
                        ? 'animate-wave [animation-delay:0s] h-[7.5px]'
                        : 'h-[9px]'
                } w-1 bg-[#B6A6F3] rounded-sm`}
            />
            <div
                className={`${
                    isPlaying
                        ? 'animate-wave [animation-delay:0.1s] h-[12.5px]'
                        : 'h-[15px]'
                } w-1 bg-[#B6A6F3] rounded-sm`}
            />
            <div
                className={`${
                    isPlaying
                        ? 'animate-wave [animation-delay:0.2s] h-[10px]'
                        : 'h-[11px]'
                } w-1 bg-[#B6A6F3] rounded-sm`}
            />
        </div>
    );
}

export { SubchapterMenuItem };
