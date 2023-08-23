import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { formatter } from 'courses/utils';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { SlCheck } from 'react-icons/sl';
import { useSelector } from 'react-redux';

const Pricing = ({
    pricingData
}: {
    pricingData?: PacketOffer[];
}): JSX.Element => {
    return (
        <section
            id="pricing"
            className="flex gap-6 justify-center flex-wrap px-[18px] py-14 md:py-[162px]">
            {pricingData?.map(
                ({
                    benefits,
                    id,
                    order,
                    packet_name,
                    price,
                    price_before_discount
                }) => (
                    <CardPrice
                        key={id}
                        benefits={benefits}
                        order={order}
                        packet_name={packet_name}
                        price={parseInt(price)}
                        price_before_discount={parseInt(price_before_discount)}
                        packetId={id}
                    />
                )
            )}
        </section>
    );
};

type Features = {
    title: string;
    description: string;
};

type Benefits = {
    feature: Features[];
};

const CardPrice = ({
    benefits,
    order,
    packet_name,
    price,
    price_before_discount,
    packetId
}: {
    benefits: Benefits;
    order: number;
    packet_name: string;
    price: number;
    price_before_discount: number;
    packetId: string;
}): JSX.Element => {
    const { checkCustomBreakpoints } = useWindowBreakpoints();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const isHighlighted = useMemo(() => order === 1, [order]);
    const router = useRouter();

    function handleClick(): void {
        if (!isAuthenticated) {
            localStorage.setItem('packetId', packetId);
            router.push('/daftar');
        } else {
            router.push(`/pembayaran?packetId=${packetId}`);
        }
    }

    return (
        <div
            className={`relative w-[324px] flex flex-col gap-4 md:gap-6 px-6 py-6 md:py-8 rounded-[16px] md:rouded-[20px] ${
                isHighlighted
                    ? 'bg-gradient-purple-pricing border-2 border-[#5F2BCE80] rounded-t-none border-t-0 mt-[50px] md:mt-0'
                    : 'bg-[#121212]'
            }`}
            style={{
                order: checkCustomBreakpoints(708)
                    ? isHighlighted
                        ? 1
                        : order + 2
                    : order
            }}>
            {isHighlighted && (
                <div className="absolute left-[-2px] top-[-50px] w-[101.3%] h-[50px] bg-[#5F2BCE80] border-2 border-[#5F2BCE80] border-b-0 rounded-b-none rounded-[16px] md:rouded-[20px] py-3 text-center font-bold text-[15px] animate-pulse">
                    PENAWARAN TERBAIK!
                </div>
            )}
            <div className="flex flex-col md:gap-1 text-center">
                <h5 className="font-extrabold text-xl md:text-2xl">
                    {packet_name}
                </h5>
                <h4
                    className={`font-body font-bold text-[32px] md:text-[40px] ${
                        isHighlighted ? 'gradient-text' : ''
                    }`}>
                    {formatter.format(price as unknown as number).split(',')[0]}
                </h4>
                <h6 className="text-xl font-bold line-through lg:text-2xl decoration-2 text-stone-500 decoration-red-600">
                    {
                        formatter
                            .format(price_before_discount as unknown as number)
                            .split(',')[0]
                    }
                </h6>
            </div>
            <div className="flex flex-col gap-[10px] md:gap-3 h-full">
                <h5 className="font-extrabold text-xl">
                    Akses Semua Kelas & Fitur
                </h5>
                {benefits?.feature?.map(({ title, description }, index) => (
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
                ))}
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

export default Pricing;
