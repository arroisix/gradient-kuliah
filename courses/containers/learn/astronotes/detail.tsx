import Image from 'next/image';
import { FaChevronRight } from 'react-icons/fa';
import { GrStar } from 'react-icons/gr';
import { ASTRONOTES } from './constant';
import AstronotesKeyword from 'courses/components/LearningExperience/AstroNotes/Detail/AstronotesKeyword';

const AstronotesDetail = (): JSX.Element => {
    return (
        <div className="mx-auto max-w-[65%] flex flex-col">
            <div className="flex flex-row gap-2.5 items-center pb-8">
                <h3 className="text-[#666666] font-bold">Perpustakaan</h3>
                <FaChevronRight size={16} className="text-[#666666]" />
                <h1 className="text-white font-bold">{ASTRONOTES.title}</h1>
            </div>

            <div className="flex flex-row gap-8 pb-6">
                <div className="aspect-[256/364] relative min-w-[150px] w-[35%] border rounded border-neutral-700">
                    <Image
                        src={
                            ASTRONOTES.cover_url ||
                            'https://assets.gradient.academy/assets/astronotes-kalkulus2-placeholder.jpg'
                        }
                        layout="fill"
                        className="rounded"
                    />
                </div>
                <div className="flex flex-col gap-5">
                    <h1 className="text-white font-extrabold text-xl">
                        {ASTRONOTES.title}
                    </h1>

                    <div className="flex flex-col gap-2">
                        {ASTRONOTES.category === 'Textbook' ? (
                            <>
                                <h2 className="font-sans">
                                    {ASTRONOTES.authors.join(', ')}
                                </h2>
                                <h2 className="font-sans text-[#999999]">{`ISBN: ${ASTRONOTES.isbn}`}</h2>
                            </>
                        ) : (
                            <div className="flex gap-1 items-center">
                                <GrStar size={20} className="text-[#999999]" />

                                <span className="font-sans text-[#999999]">
                                    {`${ASTRONOTES.rating.toFixed(1)} dari ${
                                        ASTRONOTES.feedback_total <= 10000
                                            ? ASTRONOTES.feedback_total
                                            : '10000+'
                                    } penilaian`}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2.5 pt-4">
                        {ASTRONOTES.keywords.split(',').map((value) => (
                            <AstronotesKeyword keyword={value} key={value} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full bg-[#1D1D1D] rounded">
                <div className="p-3 flex flex-col gap-4"></div>
            </div>
        </div>
    );
};

export default AstronotesDetail;
