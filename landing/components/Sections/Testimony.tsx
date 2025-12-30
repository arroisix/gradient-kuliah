import { cn } from 'commons/utils';
import { TESTIMONY_DATA } from 'landing/constants/Testimony';
import Image from 'next/image';

const Testimony = ({
    className,
    headerClassName,
    itemHeaderClassName,
    itemContentClassName,
    itemSubtitleClassName,
    noBorder
}: {
    className?: string;
    headerClassName?: string;
    itemHeaderClassName?: string;
    itemSubtitleClassName?: string;
    itemContentClassName?: string;
    noBorder?: boolean;
}): JSX.Element => {
    const NUM_OF_TESTIMONY_LAYOUT = 5;
    const temporaryArray = Array.from(
        { length: NUM_OF_TESTIMONY_LAYOUT },
        () => 0
    );

    return (
        <section
            className={cn('flex flex-col gap-5 py-9 md:py-16', className)}
            id="testimony">
            <h2
                className={cn(
                    'font-sans text-xl font-extrabold text-center',
                    headerClassName
                )}>
                Kata mereka yang belajar bersama Gradient
            </h2>
            <div className="overflow-hidden flex group">
                {temporaryArray.map((_, idx) => (
                    <div
                        key={`testimony-layout-${idx + 1}`}
                        className="flex gap-5 md:gap-6 px-[10px] md:px-3 animate-slide-left group-hover:animate-pause">
                        {TESTIMONY_DATA.map((data) => (
                            <TestimonyCard
                                testimony={data.testimony}
                                photo={data.photo}
                                name={data.name}
                                role={data.role}
                                key={data.name}
                                contentClassName={itemContentClassName}
                                subtitleClassName={itemSubtitleClassName}
                                headerClassName={itemHeaderClassName}
                                noBorder={noBorder}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
};

const TestimonyCard = ({
    testimony,
    name,
    role,
    photo,
    headerClassName,
    contentClassName,
    subtitleClassName,
    noBorder
}: {
    testimony: string;
    name: string;
    role: string;
    photo: string;
    headerClassName?: string;
    subtitleClassName?: string;
    contentClassName?: string;
    noBorder?: boolean;
}): JSX.Element => {
    return (
        <div className="w-[245px] md:w-[422px] p-6 bg-gradient-to-t from-[#FFFFFF00] to-[#FFFFFF0D] border-[1px] border-[#2D2D2D] rounded-[24px]">
            <div
                className={cn(
                    'flex gap-4 items-center pb-6 border-[#2D2D2D]',
                    !noBorder && 'border-b-[1px]'
                )}>
                <div className="w-10 h-10 overflow-hidden rounded-full">
                    <Image
                        loading="lazy"
                        src={photo}
                        height={56}
                        width={56}
                        className="object-cover"
                        alt="testimony"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <span
                        className={cn(
                            'inline-block text-xs font-extrabold',
                            headerClassName
                        )}>
                        {name}
                    </span>
                    <span
                        className={cn(
                            'inline-block font-body text-[10px] text-neutral-400',
                            subtitleClassName
                        )}>
                        {role}
                    </span>
                </div>
            </div>
            <article>
                <p
                    className={cn(
                        'text-xs font-body md:text-sm',
                        !noBorder && 'pt-6',
                        contentClassName
                    )}>
                    {testimony}
                </p>
            </article>
        </div>
    );
};

export default Testimony;
