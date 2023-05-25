import SubscribeButton from 'courses/components/LandingPage/Common/SubscribeButton';
import { formatter } from 'courses/utils';
import { useGetPacketOfferQuery } from 'payment/redux/api/subscriptionApi';
import { useMemo } from 'react';

const PacketCard = ({
    data
}: GradientBaseComponentWithData<PacketOffer>): JSX.Element => {
    const isHighlighted = useMemo(() => data.order === 1, [data]);

    return (
        <div
            className={
                isHighlighted
                    ? 'w-full p-[5px] bg-[linear-gradient(43.82deg,#ECD0CD_0%,#DD837A_28.35%,#CAC7E4_56.15%,#AB8EEC_74.31%)] rounded-[20px] overflow-hidden'
                    : 'w-full '
            }>
            {isHighlighted && (
                <div className="w-full p-2 flex justify-center items-center animate-pulse">
                    <span className="text-center font-bold">
                        PENAWARAN TERBAIK!
                    </span>
                </div>
            )}
            <div
                className={`flex flex-col gap-2 justify-center items-center px-4 py-8 w-full lg:w-[380px] ${
                    isHighlighted ? 'rounded-b-[20px]' : 'rounded-[20px]'
                } backdrop-blur-sm bg-[#121212]`}>
                <div className="flex flex-col">
                    <p
                        className={`font-bold  text-center text-2xl lg:text-3xl
                        ${
                            isHighlighted
                                ? 'gradient-text animate-pulse'
                                : 'text-white'
                        }
                    `}>
                        {data.packet_name}
                    </p>
                    <h3 className="line-through text-xl lg:text-2xl font-bold text-center decoration-2 text-stone-500 decoration-red-600">
                        {
                            formatter
                                .format(
                                    data.price_before_discount as unknown as number
                                )
                                .split(',')[0]
                        }
                    </h3>
                    <div className="relative">
                        <h1
                            className={`text-[35px] lg:text-[40px] font-bold text-center font-body ${
                                data.order === 1
                                    ? 'gradient-blur-text animate-pulse'
                                    : 'text-white'
                            }`}>
                            {data.is_free
                                ? 'GRATIS'
                                : formatter
                                      .format(data.price as unknown as number)
                                      .split(',')[0]}
                        </h1>
                    </div>
                </div>
                <ul className="grid grid-cols-1 content-center py-4">
                    {data.benefits?.data.map((benefit: string) => (
                        <li className="font-body lg:text-lg" key={benefit}>
                            {benefit}
                        </li>
                    ))}
                </ul>
                <SubscribeButton
                    packetId={data.id}
                    className={
                        isHighlighted ? 'animate-pulse' : '!bg-neutral-900'
                    }
                />
            </div>
        </div>
    );
};

const SubscribePacket = (): JSX.Element => {
    const { data: packets, isLoading } = useGetPacketOfferQuery();

    return (
        <section className="min-h-screen py-24 px-4 md:px-[7.5rem] flex flex-col items-center justify-center gap-8 lg:gap-16">
            <h4 className="text-2xl lg:text-3xl font-bold">
                Akses Semua Kelas Tanpa Batas.
            </h4>
            <div className="flex flex-col lg:flex-row gap-4 items-end w-full">
                {isLoading && (
                    <>
                        <div className="h-[402px] w-full lg:w-[380px] bg-neutral-600 animate-pulse rounded-[20px]" />
                        <div className="h-[402px] w-full lg:w-[380px] bg-neutral-600 animate-pulse rounded-[20px]" />
                        <div className="h-[402px] w-full lg:w-[380px] bg-neutral-600 animate-pulse rounded-[20px]" />
                    </>
                )}
                {packets?.data.map((packet: PacketOffer) => (
                    <PacketCard data={packet} key={packet.id} />
                ))}
            </div>
        </section>
    );
};

export default SubscribePacket;
