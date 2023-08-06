import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { formatter } from 'courses/utils';
// import { addZeroBefore, formatter } from 'courses/utils';
import { useRouter } from 'next/router';
import { useGetPacketOfferQuery } from 'payment/redux/api/subscriptionApi';
import { useEffect, useMemo, useState } from 'react';
import { SlCheck } from 'react-icons/sl';
import { useSelector } from 'react-redux';

const PacketCard = ({
    data
}: GradientBaseComponentWithData<PacketOffer>): JSX.Element => {
    const { checkCustomBreakpoints } = useWindowBreakpoints();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const isHighlighted = useMemo(() => data.order === 1, [data.order]);
    const router = useRouter();
    // const currentDate = new Date();

    function handleClick(): void {
        if (!isAuthenticated) {
            router.push('/daftar');
        } else {
            // redirect to pembayaran page
            router.push(`/pembayaran?packetId=${data.id}`);

            // redirect to WhatsApp
            // window.open(
            //     `https://api.whatsapp.com/send?phone=6285173430127&text=${encodeURIComponent(
            //         `Halo, Saya tertarik untuk berlangganan ${
            //             data.packet_name
            //         }\n\n[ID:${currentDate.getDate()}${addZeroBefore(
            //             currentDate.getMonth() + 1
            //         )}${currentDate.getFullYear()}]`
            //     )}`
            // );
        }
    }

    return (
        <div
            className={`relative w-[324px] flex flex-col gap-4 md:gap-6 px-6 py-6 md:py-8 rounded-[16px] md:rouded-[20px] ${
                isHighlighted
                    ? 'bg-gradient-purple-pricing border-2 border-[#5F2BCE80] rounded-t-none border-t-0 mt-[50px] sm:mt-0'
                    : 'bg-[#121212]'
            }`}
            style={{
                order: checkCustomBreakpoints(708)
                    ? isHighlighted
                        ? 1
                        : data.order + 2
                    : data.order
            }}>
            {isHighlighted && (
                <div className="absolute left-[-2px] top-[-50px] w-[101.3%] h-[50px] bg-[#5F2BCE80] border-2 border-[#5F2BCE80] border-b-0 rounded-b-none rounded-[16px] md:rouded-[20px] py-3 text-center font-bold text-[15px] animate-pulse">
                    PENAWARAN TERBAIK!
                </div>
            )}
            <div className="flex flex-col md:gap-1 text-center">
                <h5 className="font-extrabold text-xl md:text-2xl">
                    {data.packet_name}
                </h5>
                <h4
                    className={`font-body font-bold text-[32px] md:text-[40px] ${
                        isHighlighted ? 'gradient-text' : ''
                    }`}>
                    {
                        formatter
                            .format(data.price as unknown as number)
                            .split(',')[0]
                    }
                </h4>
                <h6 className="text-xl font-bold line-through lg:text-2xl decoration-2 text-stone-500 decoration-red-600">
                    {
                        formatter
                            .format(
                                data.price_before_discount as unknown as number
                            )
                            .split(',')[0]
                    }
                </h6>
            </div>
            <div className="flex flex-col gap-[10px] md:gap-3 h-full">
                {data?.benefits?.feature?.map(
                    ({ title, description }, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <SlCheck className="text-accent-purple" size={32} />
                            <div className="flex flex-col">
                                <span className="inline-block font-extrabold text-sm">
                                    {title}
                                </span>
                                <span className="inline-block font-body text-xs">
                                    {description}
                                </span>
                            </div>
                        </div>
                    )
                )}
            </div>
            <Button
                variant={isHighlighted ? 'primary' : 'custom'}
                className={`${isHighlighted ? '' : 'bg-[#212121]'}`}
                onClick={handleClick}>
                Akses Sekarang
            </Button>
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
        <section className="min-h-screen py-24 px-[18px] flex flex-col items-center justify-center gap-8 lg:gap-16">
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
            <div className="w-full flex gap-6 justify-center flex-wrap mt-14">
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
