import Layout from 'commons/utbkLayout';
import FAQ from 'landing/components/utbk/FAQ';
import FinalCTA from 'landing/components/utbk/FinalCTA';
import Fitur from 'landing/components/utbk/Fitur';
import Hero from 'landing/components/utbk/Hero';
import Langganan from 'landing/components/utbk/Langganan';
import Testimony from 'landing/components/Sections/Testimony';

export default function UTBK(): JSX.Element {
    return (
        <Layout>
            <div className="flex flex-col w-full">
                <Hero />
                <Testimony
                    className="pt-24 pb-16 gap-[52px]"
                    headerClassName="text-white text-2xl leading-[125%] md:text-3xl"
                    itemHeaderClassName="text-white font-[Raleway,sans-serif] leading-[125%]"
                    itemSubtitleClassName="font-['Open_Sans',sans-serif] leading-[150%]"
                    itemContentClassName="text-white !text-xs !leading-[160%]"
                    noBorder
                />
                <Fitur className="mb-[40px] mx-4" />
                <Langganan className="mb-12 mx-4" />
                <FAQ className="mb-10 mx-4 sm:mx-8 max-w-[736px] self-center w-[calc(100%-32px)] sm:w-[calc(100%-64px)]" />
                <FinalCTA className="sm:mx-8 sm:w-[calc(100%-64px)] mb-12" />
            </div>
        </Layout>
    );
}
