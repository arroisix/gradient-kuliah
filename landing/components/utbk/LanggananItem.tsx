import { useAuth } from 'authentication/contexts/AuthProvider';
import Button from 'commons/components/elements/Button';
import { CDN_URL } from 'commons/constants';
import { cn } from 'commons/utils';
import { useRouter } from 'next/router';
import { FaRegCircleCheck } from 'react-icons/fa6';

const rupiahFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
});

interface LanggananItemProps {
    packet: PacketOffer;
    subtitle?: string;
    isVideoPaywall?: boolean;
}

export default function LanggananItem({
    packet,
    subtitle,
    isVideoPaywall = false
}: LanggananItemProps): JSX.Element {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    function handleClick(): void {
        if (!isAuthenticated) {
            router.push(`/daftar?redirect=/pembayaran/?packetId=${packet.id}`);
        } else {
            // redirect to pembayaran page
            router.push({
                pathname: '/pembayaran',
                query: { ...router.query, packetId: packet.id }
            });
        }
    }

    return (
        <article
            className={cn(
                'flex flex-col items-center border-2 border-solid border-[#36236A] hover:border-[#5F2BCE] rounded-2xl py-6 relative shadow-[0px_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0px_8px_12px_6px_rgba(0,0,0,0.15),0px_4px_4px_rgba(0,0,0,0.3)] transition',
                packet.order === 3 && 'bg-[#36236A] bg-opacity-50',
                isVideoPaywall ? 'w-full justify-between' : ''
            )}>
            <div className="flex flex-col items-center">
                {packet.order === 3 ? (
                    <img
                        src={`${CDN_URL}/assets/utbk/best_value.svg`}
                        alt="Best value."
                        width={88}
                        className="absolute -top-[9px] -right-[3px]"
                    />
                ) : null}

                <h3 className="flex flex-col gap-1 text-base leading-[125%] text-white text-center font-bold mb-4">
                    {packet.packet_name}
                    <span className="font-normal text-xs leading-[140%] -tracking-[0.005em]">
                        {subtitle ?? packet.benefits.info}
                    </span>
                </h3>
                <p
                    className="mb-8 font-extrabold text-white text-[32px] leading-[125%]"
                    style={
                        packet.order === 3
                            ? {
                                  background:
                                      'linear-gradient(43.82deg, #CAC7E4 0%, #AB8EEC 28.4%, #DD837A 65.1%, #ECD0CD 100%)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                  backgroundClip: 'text'
                              }
                            : undefined
                    }>
                    {rupiahFormatter.format(packet.price as unknown as number)}
                    {packet.active_duration ? (
                        <span className="text-[#929292] text-xs leading-[125%] font-bold">
                            {' '}
                            /{packet.active_duration / 30} bln
                        </span>
                    ) : null}
                </p>
                <ol className="mb-8 p-0 list-none [&>li>p]:text-white [&>li>p]:font-bold [&>li>p]:text-sm [&>li>p]:leading-[125%] [&>li.disabled>p]:text-[#333333] flex flex-col gap-4 w-full px-6">
                    {packet.benefits.data.map((benefit, index) => (
                        <li
                            className="flex gap-3 items-center"
                            key={`${packet.id}-benefit-${index}`}>
                            <FaRegCircleCheck
                                size={24}
                                color={
                                    benefit.includes('_CHECK')
                                        ? '#7264EB'
                                        : '#333333'
                                }
                            />
                            <p
                                style={
                                    packet.order === 3 && index === 0
                                        ? {
                                              background:
                                                  'linear-gradient(43.82deg, #CAC7E4 0%, #AB8EEC 28.4%, #DD837A 65.1%, #ECD0CD 100%)',
                                              WebkitBackgroundClip: 'text',
                                              WebkitTextFillColor:
                                                  'transparent',
                                              backgroundClip: 'text'
                                          }
                                        : undefined
                                }>
                                {benefit.split('_CHECK')[0]}
                            </p>
                        </li>
                    ))}
                </ol>
            </div>
            {packet.is_free ? (
                <Button
                    variant="secondary"
                    className="h-[49px] text-[15px] leading-[140%] flex items-center justify-center"
                    href="/daftar">
                    Daftar Gratis
                </Button>
            ) : (
                <Button
                    onClick={handleClick}
                    variant="primary"
                    className="h-[49px] text-[15px] leading-[140%]">
                    Pilih Paket
                </Button>
            )}
        </article>
    );
}
