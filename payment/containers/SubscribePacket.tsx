import SubscribeButton from 'courses/components/LandingPage/Common/SubscribeButton';
import { formatter } from 'courses/utils';
import { useGetPacketOfferQuery } from 'payment/redux/api/subscriptionApi';
import { useEffect, useMemo, useState } from 'react';

const PacketCard = ({
    data
}: GradientBaseComponentWithData<PacketOffer>): JSX.Element => {
    const isHighlighted = useMemo(() => data.order === 1, [data]);

    return (
        <div
            className={
                isHighlighted
                    ? 'w-full lg:w-fit p-[5px] bg-[linear-gradient(43.82deg,#ECD0CD_0%,#DD837A_28.35%,#CAC7E4_56.15%,#AB8EEC_74.31%)] rounded-[20px] overflow-hidden'
                    : 'w-full lg:w-fit'
            }>
            {isHighlighted && (
                <div className="flex items-center justify-center w-full p-2 animate-pulse">
                    <span className="font-bold text-center">
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
                    <h3 className="text-xl font-bold text-center line-through lg:text-2xl decoration-2 text-stone-500 decoration-red-600">
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
                <ul className="grid content-center grid-cols-1 py-4">
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

    const [countdown, setCountdown] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            const now = new Date();
            const endDay =
                new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate() + 1,
                    0,
                    0,
                    0
                ).getTime() - now.getTime();

            const hours = Math.floor(
                (endDay % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
                (endDay % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((endDay % (1000 * 60)) / 1000);

            setCountdown({ hours, minutes, seconds });
        }, 1000);

        return () => {
            clearInterval(countdownInterval);
        };
    }, []);

    return (
        <section className="min-h-screen py-24 px-4 md:px-[7.5rem] flex flex-col items-center justify-center gap-8 lg:gap-16">
            <h4 className="flex flex-col lg:flex-row gap-3 items-center font-bold text-3xl text-center">
                <span>Promo akan berakhir dalam</span>
                <div className="grid grid-flow-col gap-1 items-center text-center auto-cols-max">
                    <div className="flex flex-col p-2 pb-3 bg-[#212121] rounded-box">
                        <span className="countdown font-semibold text-3xl">
                            <span
                                style={
                                    {
                                        '--value': countdown.hours
                                    } as React.CSSProperties
                                }></span>
                        </span>
                    </div>
                    :
                    <div className="flex flex-col p-2 pb-3 bg-[#212121] rounded-box">
                        <span className="countdown font-semibold text-3xl">
                            <span
                                style={
                                    {
                                        '--value': countdown.minutes
                                    } as React.CSSProperties
                                }></span>
                        </span>
                    </div>
                    :
                    <div className="flex flex-col p-2 pb-3 bg-[#212121] rounded-box">
                        <span className="countdown font-semibold text-3xl">
                            <span
                                style={
                                    {
                                        '--value': countdown.seconds
                                    } as React.CSSProperties
                                }></span>
                        </span>
                    </div>
                </div>
            </h4>
            <div className="flex flex-col items-end justify-center w-full gap-4 lg:flex-row">
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
