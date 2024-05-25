import { TESTIMONY_DATA } from 'landing/constants/Testimony';
import Image from 'next/image';

const Testimony = (): JSX.Element => {
    const NUM_OF_TESTIMONY_LAYOUT = 5;
    const temporaryArray = Array.from(
        { length: NUM_OF_TESTIMONY_LAYOUT },
        () => 0
    );

    return (
        <section className="flex flex-col gap-5 py-9 md:py-16">
            <h2 className="font-sans text-xl font-extrabold text-center">
                Kata mereka yang belajar bersama Gradient
            </h2>
            <div className="overflow-hidden flex group">
                {temporaryArray.map((idx) => (
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
    photo
}: {
    testimony: string;
    name: string;
    role: string;
    photo: string;
}): JSX.Element => {
    return (
        <div className="w-[245px] md:w-[422px] p-6 bg-gradient-to-t from-[#FFFFFF00] to-[#FFFFFF0D] border-[1px] border-[#2D2D2D] rounded-[24px]">
            <div className="flex gap-4 items-center pb-6 border-b-[1px] border-[#2D2D2D]">
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
                <div className="flex flex-col md:gap-[6px]">
                    <span className="inline-block text-xs font-extrabold">
                        {name}
                    </span>
                    <span className="inline-block font-body text-[10px] text-neutral-400">
                        {role}
                    </span>
                </div>
            </div>
            <article>
                <p className="pt-6 text-xs font-body md:text-sm">{testimony}</p>
            </article>
        </div>
    );
};

export default Testimony;
