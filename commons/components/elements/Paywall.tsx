import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { formatter } from 'courses/utils';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
import { SlCheck } from 'react-icons/sl';
import { useSelector } from 'react-redux';
import Button from './Button';
import { cn, queryParamBuilder } from 'commons/utils';

type PaywallProps = {
    isCarousel?: boolean;
    isCompact?: boolean;
    pricingData?: PacketOffer[];
    ctaEventName?: string;
    redirect?: string;
    ctaEventPayload?: Record<string, unknown>;
    pricingClassName?: string;
    highlightedClassName?: string;
} & PropsWithClassName;

const Paywall = ({
    isCarousel,
    isCompact,
    pricingData,
    className,
    pricingClassName,
    highlightedClassName,
    ctaEventName,
    ctaEventPayload,
    redirect
}: PaywallProps): JSX.Element => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const isAuthenticated = useSelector(getIsAuthenticated);
    const router = useRouter();

    const centerScroll = (): void => {
        const container = carouselRef.current;
        const element = container?.querySelector(
            '.carousel-item:nth-child(2)'
        ) as HTMLDivElement;
        if (container && element) {
            container.scrollLeft =
                element.offsetLeft -
                (container.offsetWidth - element.offsetWidth) / 2;
        }
    };

    useEffect(() => {
        const handleResize = (): void => centerScroll();
        if (isCarousel) {
            centerScroll();
            window.addEventListener('resize', handleResize);
        }
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isCarousel]);

    const handleClick = (packetId: string): void => {
        if (redirect) localStorage.setItem('redirect', redirect as string);

        if (!isAuthenticated) {
            localStorage.setItem('packetId', packetId);
            router.push(`/daftar?redirect=${redirect ?? '/langganan'}`);
        } else {
            router.push(
                `/pembayaran?${queryParamBuilder({
                    packetId,
                    redirect: redirect as string
                })}`
            );
        }
    };

    const formatPrice = (price: string): string => {
        return formatter.format(price as unknown as number).split(',')[0];
    };

    return (
        <div
            ref={carouselRef}
            className={cn(
                'items-center gap-4',
                className,
                isCarousel
                    ? 'carousel carousel-center px-4'
                    : [
                          'flex flex-col',
                          isCompact
                              ? 'xl:flex-row xl:flex-nowrap'
                              : 'md:flex-row md:flex-wrap lg:flex-nowrap'
                      ]
            )}>
            {pricingData?.map((pricing) => {
                const isHighlighted = pricing.order === 1;

                return (
                    <div
                        key={pricing.id}
                        className={cn(
                            'relative w-full flex flex-col rounded-box',
                            isCompact ? 'max-w-xs md:max-w-sm' : 'max-w-sm',
                            isCarousel && 'carousel-item',
                            isHighlighted
                                ? [
                                      'order-first bg-gradient-purple-pricing border-2 border-accent-purple/80',
                                      isCompact
                                          ? 'xl:order-none'
                                          : 'sm:order-none',
                                      highlightedClassName
                                  ]
                                : 'order-none bg-[#222222]',
                            pricingClassName
                        )}>
                        {isHighlighted && (
                            <div className="w-full py-3 font-bold text-center rounded-t-box animate-pulse bg-accent-purple/50 ">
                                PENAWARAN TERBAIK!
                            </div>
                        )}
                        <div
                            className={cn(
                                'flex flex-col',
                                isCompact
                                    ? 'gap-4 p-4 md:py-6'
                                    : 'gap-4 p-6 md:gap-6 md:py-8'
                            )}>
                            <div className="flex flex-col text-center md:gap-1">
                                <h4 className="font-extrabold">
                                    {pricing.packet_name}
                                </h4>
                                <h5
                                    className={cn(
                                        'text-4xl font-extrabold font-body',
                                        isHighlighted &&
                                            'bg-clip-text bg-gradient-highlighted-price text-transparent'
                                    )}>
                                    {formatPrice(pricing.price)}
                                </h5>
                                <h6 className="text-xl font-bold line-through decoration-2 text-stone-500 decoration-red-600 font-body">
                                    {formatPrice(pricing.price_before_discount)}
                                </h6>
                            </div>
                            <div className="flex flex-col h-full gap-3">
                                {pricing.benefits?.feature?.map(
                                    ({ title, description }, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3">
                                            <SlCheck
                                                className="flex-none text-accent-purple"
                                                size={32}
                                            />
                                            <div>
                                                <p className="text-sm font-extrabold">
                                                    {title}
                                                </p>
                                                <p className="text-xs text-neutral-400 font-body">
                                                    {description}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                            <Button
                                variant="primary"
                                onClick={() => handleClick(pricing.id)}
                                eventName={ctaEventName}
                                eventPayload={{
                                    'Packet Name': pricing.packet_name,
                                    Variant: 'NOV 2023',
                                    ...ctaEventPayload
                                }}>
                                Akses Sekarang
                            </Button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Paywall;
