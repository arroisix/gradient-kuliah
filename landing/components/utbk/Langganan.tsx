import { cn } from 'commons/utils';
import LanggananItem from 'landing/components/utbk/LanggananItem';
import { useGetPacketOfferUTBKQuery } from 'payment/redux/api/subscriptionApi';
import { useEffect, useRef } from 'react';

interface LanggananProps {
    className?: string;
    packetClassName?: string;
    removeFree?: boolean;
    isVideoPaywall?: boolean;
}

export default function Langganan({
    className,
    packetClassName,
    removeFree,
    isVideoPaywall = false
}: LanggananProps): JSX.Element {
    const { data } = useGetPacketOfferUTBKQuery();
    const carouselRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isVideoPaywall && carouselRef.current) {
            const carousel = carouselRef.current;
            const scrollWidth = carousel.scrollWidth;
            const clientWidth = carousel.clientWidth;
            carousel.scrollLeft = (scrollWidth - clientWidth) / 2;
        }
    }, [isVideoPaywall, data?.data]);

    return (
        <section
            id="langganan"
            className={cn('flex flex-col scroll-pt-24', className)}>
            {!isVideoPaywall ? (
                <>
                    <h2 className="flex flex-col items-center text-center gap-3 text-white text-2xl leading-[125%] font-bold mb-3">
                        Langganan untuk
                        <br className="sm:hidden" /> mengakses semua materi
                    </h2>
                    <p className="text-[#9CA3AF] text-sm leading-[20px] text-center mb-10">
                        Pilih paket yang paling pas buat target UTBK kamu.
                    </p>
                </>
            ) : (
                <></>
            )}

            {isVideoPaywall ? (
                <div
                    ref={carouselRef}
                    className="carousel carousel-center w-full space-x-8 [&::-webkit-scrollbar]:block [scrollbar-width:auto]">
                    {data?.data.map((packet) => (
                        <li
                            key={packet.id}
                            className="w-full max-w-[350px] carousel-item">
                            <LanggananItem packet={packet} isVideoPaywall />
                        </li>
                    ))}
                </div>
            ) : (
                <ol
                    className={cn(
                        'list-none flex flex-wrap gap-x-4 gap-y-4 md:gap-y-10 max-w-[1082px] justify-center self-center p-0 w-full',
                        packetClassName
                    )}>
                    {removeFree
                        ? data?.data
                              .filter((packet) => !packet.is_free)
                              .map((packet) => (
                                  <li
                                      key={packet.id}
                                      className="w-full max-w-[350px]">
                                      <LanggananItem packet={packet} />
                                  </li>
                              ))
                        : data?.data.map((packet) => (
                              <li
                                  key={packet.id}
                                  className="w-full self-stretch max-w-[350px]">
                                  <LanggananItem packet={packet} />
                              </li>
                          ))}
                </ol>
            )}
        </section>
    );
}
