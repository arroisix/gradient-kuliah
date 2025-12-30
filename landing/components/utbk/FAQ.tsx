import Accordion from 'commons/components/elements/Accordion';
import { FAQ_DATA } from 'landing/constants/UTBK';

interface FAQProps {
    className?: string;
}

export default function FAQ({ className }: FAQProps): JSX.Element {
    return (
        <section className={className}>
            <h2 className="flex flex-col items-center text-center gap-3 text-white text-2xl leading-[125%] font-bold mb-3">
                Sering Ditanyakan
            </h2>
            <p className="text-[#9CA3AF] text-sm leading-[20px] text-center mb-10">
                Jawaban untuk pertanyaan seputar persiapan UTBK di Gradient.
            </p>
            <Accordion
                containerClassName="shadow-[0px_8px_12px_6px_rgba(0,0,0,0.15),0px_4px_4px_rgba(0,0,0,0.3)] bg-[#181818] transition-colors hover:bg-[#222222]"
                headerClassName="text-left text-white text-base leading-[140%] gap-2 bg-transparent"
                iconClassName="text-[#999999]"
                contentClassName="text-[#DEDEDE] text-sm leading-[160%] bg-transparent"
                item={FAQ_DATA}
            />
        </section>
    );
}
