import { cn } from 'commons/utils';
import LanggananItem from 'landing/components/utbk/LanggananItem';
import { useGetPacketOfferUTBKQuery } from 'payment/redux/api/subscriptionApi';

interface LanggananProps {
    className?: string;
    packetClassName?: string;
    removeFree?: boolean;
}

export default function Langganan({
    className,
    packetClassName,
    removeFree
}: LanggananProps): JSX.Element {
    const { data } = useGetPacketOfferUTBKQuery();
    return (
        <section className={cn('flex flex-col', className)}>
            <h2 className="flex flex-col items-center text-center gap-3 text-white text-2xl leading-[125%] font-bold mb-3">
                Langganan untuk
                <br className="sm:hidden" /> mengakses semua materi
            </h2>
            <p className="text-[#9CA3AF] text-sm leading-[20px] text-center mb-10">
                Pilih paket yang paling pas buat target UTBK kamu.
            </p>
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
                          <li key={packet.id} className="w-full max-w-[350px]">
                              <LanggananItem packet={packet} />
                          </li>
                      ))}
            </ol>
        </section>
    );
}
