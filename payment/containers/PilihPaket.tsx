import { useGetPacketOfferQuery } from 'payment/redux/api/subscriptionApi';
import { PacketCard } from './SubscribePacket';
import { FaChevronLeft } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useAuth } from 'authentication/contexts/AuthProvider';
import Langganan from 'landing/components/utbk/Langganan';

const PilihPaket = (): JSX.Element => {
    const router = useRouter();
    const { profile } = useAuth();

    if (profile?.current_role === 'K12') {
        return (
            <section className="py-4 lg:py-24 px-[18px] m-auto max-w-[1064px] w-full">
                <button
                    className="rounded-full p-[10px] self-start bg-[#212121]"
                    onClick={() => router.back()}>
                    <FaChevronLeft />
                </button>
                <Langganan removeFree />
            </section>
        );
    }

    const { data: packets, isLoading } = useGetPacketOfferQuery();

    return (
        <section className="py-24 px-[18px] mt-14 m-auto max-w-[1064px] w-full">
            <button
                className="rounded-full p-[10px] self-start bg-[#212121]"
                onClick={() => router.back()}>
                <FaChevronLeft />
            </button>
            <h4 className="text-base lg:text-xl font-bold text-center mb-4 sm:mb-[82px]">
                Pilih paket belajar
            </h4>
            <div className="flex flex-wrap justify-center w-full gap-6">
                {isLoading && (
                    <>
                        <div className="h-[402px] w-full lg:w-[380px] bg-neutral-600 animate-pulse rounded-[20px]" />
                        <div className="h-[402px] w-full lg:w-[380px] bg-neutral-600 animate-pulse rounded-[20px]" />
                        <div className="h-[402px] w-full lg:w-[380px] bg-neutral-600 animate-pulse rounded-[20px]" />
                    </>
                )}
                {packets?.data.map((packet: PacketOffer) => (
                    <PacketCard
                        data={packet}
                        key={packet.id}
                        ctaText="Pilih Paket"
                        blackBg
                    />
                ))}
            </div>
        </section>
    );
};

export default PilihPaket;
