import Image from 'next/image';

const Description = (): JSX.Element => {
    return (
        <div className="flex flex-col lg:flex-row justify-between gap-4 lg:gap-[150px] px-5 md:px-16">
            <article>
                <p className="font-body text-xs md:text-base">
                    Amet minim mollit non deserunt ullamco est sit aliqua dolor
                    do amet sint. Velit officia consequat duis enim velit
                    mollit. Exercitation veniam consequat sunt nostrud amet.
                    Amet minim mollit non deserunt ullamco est sit aliqua dolor
                    do amet sint. Velit officia consequat duis enim velit
                    mollit. Exercitation veniam consequat sunt nostrud amet
                    minim mollit.
                </p>
            </article>
            <div className="bg-[#FFFFFF08] rounded-[10px]">
                <div className="flex justify-center gap-8 sm:gap-10 px-6 py-5 border-b border-[#2D2D2D]">
                    <div className="flex flex-col gap-[10px] justify-end items-center">
                        <div className="w-[36px] h-[32px] flex items-end gap-[6px]">
                            <div
                                className={`w-[8px] h-[40%] rounded-[100px] bg-accent-purple`}></div>
                            <div
                                className={`w-[8px] h-[70%] rounded-[100px] bg-white`}></div>
                            <div
                                className={`w-[8px] h-[100%] rounded-[100px] bg-white`}></div>
                        </div>
                        <span className="inline-block font-body text-[#CCCCCC] text-xs md:text-base whitespace-nowrap">
                            Level pemula
                        </span>
                    </div>
                    <div className="flex flex-col gap-[10px] items-center">
                        <span className="inline-block font-body font-bold text-[22px] md:text-[28px]">
                            4.9
                        </span>
                        <span className="inline-block font-body text-[#CCCCCC] text-xs md:text-base">
                            Nilai
                        </span>
                    </div>
                    <div className="flex flex-col gap-[10px] items-center">
                        <span className="inline-block font-body font-bold text-[22px] md:text-[28px]">
                            20
                        </span>
                        <span className="inline-block font-body text-[#CCCCCC] text-xs md:text-base">
                            AstroNotes
                        </span>
                    </div>
                </div>
                <div className="flex flex-col gap-3 p-5">
                    <span className="inline-block font-body text-neutral-600 text-xs md:text-base">
                        PENGAJAR
                    </span>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-3 items-center">
                            <Image
                                src={'/'}
                                width={48}
                                height={48}
                                className="object-contain rounded-full"
                            />
                            <div className="flex flex-col gap-1">
                                <span className="inline-block font-body text-[#CCCCCC] text-xs md:text-base">
                                    Dr. Budi Budiman S. Kom, Ph.D
                                </span>
                                <span className="inline-block font-extrabold text-xs md:text-base">
                                    S2 di Stanford University
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Description;
