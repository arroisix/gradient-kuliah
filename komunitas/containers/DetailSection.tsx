import AnswerCard from 'komunitas/components/AnswerCard';
import { MdChevronRight } from 'react-icons/md';
// import { CgSearch } from 'react-icons/cg';

const DUMMY_SIMILIAR = [
    { text: 'ashdjkhasjkd' },
    { text: 'HALOOsdadh dahsd kaasd asdjha djhahsd sda ashd kah' },
    { text: 'Kun fakaytun' },
    { text: 'Kun fakaytun' },
    { text: 'Kun fakaytun' },
    { text: 'Kun fakaytun' },
    { text: 'Kun fakaytun' },
    { text: 'Kun fakaytun' },
    { text: 'Kun fakaytun' },
    { text: 'Kun fakaytun' },
    { text: 'Kun fakaytun' },
    { text: 'Kun fakaytun' }
];

const DetailSection = (): JSX.Element => {
    return (
        <section className="flex flex-col lg:flex-row gap-[2rem]">
            <div className="w-full lg:w-8/12">
                <AnswerCard isVerified={true} />
            </div>
            <div className="relative w-screen md:w-full lg:w-4/12 h-[350px] bg-[#121212] ml-[-16px] md:m-0 px-[18px] py-5 md:rounded-lg overflow-hidden">
                <h4 className="font-extrabold pb-[20px]">Pertanyaan Serupa</h4>
                <div className="flex flex-col gap-2 px-[10px] py-[10px] bg-[#1D1D1D] rounded">
                    {DUMMY_SIMILIAR.map(({ text }, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center gap-2 py-1 cursor-pointer z-[1]">
                            <span className="text-xs whitespace-nowrap text-ellipsis overflow-hidden">
                                {text}
                            </span>
                            <div>
                                <MdChevronRight
                                    className="text-neutral-600"
                                    size={18}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="absolute w-full h-full left-0 top-0">
                    <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-b from-transparent via-[#121212] to-[#121212] z-[1]"></div>
                    <div className="absolute bottom-0 left-0 w-full px-[18px] z-[1]">
                        <button className="bg-neutral-800 font-extrabold text-xs w-full py-2 rounded-[70px]">
                            Lihat di Komunitas
                        </button>
                        <div className="w-full h-[48px] md:h-[20px] bg-[#121212]"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DetailSection;
