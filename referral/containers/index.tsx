import Button from 'commons/components/elements/Button';
import Coin from 'commons/components/elements/Icons/Coin';
import Ticket from 'commons/components/elements/Icons/Ticket';
import Skeleton from 'commons/components/elements/Skeleton';
import { useRouter } from 'next/router';
import { FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DisclosureTutorial from 'referral/components/DisclosureTutorial';
import Menu from 'referral/components/Menu';
import { useGetReferralQuery } from 'referral/redux/referalApi';
import { useTracker } from 'tracker/tracker';

const ReferralContainer = (): JSX.Element => {
    const router = useRouter();

    const { data, isLoading } = useGetReferralQuery();

    function handleCopy(): void {
        navigator.clipboard.writeText(data?.referral_code ?? '');
        toast.info('Berhasil tersalin ke clipboard', {
            theme: 'colored'
        });
    }

    function formatCashbackAmount(amount: string): string {
        return `${Number(amount) / 1000}K`.replace('.', ',');
    }

    const tracker = useTracker();

    return (
        <section className="flex flex-col gap-6 w-full md:w-[70%] max-w-[725px] mx-auto pt-[96px] pb-5">
            <h2 className="text-base font-extrabold text-center md:text-2xl">
                Kode Referral
            </h2>
            <div className="flex flex-col gap-7 px-12 md:px-[60px] py-7 bg-[#5F2BCE] md:rounded-xl">
                <Coin className="mx-auto" />
                <article className="flex flex-col gap-[10px]">
                    <h3 className="font-extrabold text-center md:text-base">
                        Ajak teman ke Gradient, dapatkan cashback{' '}
                        {formatCashbackAmount(
                            data?.config.voucher_cashback_amount ?? ''
                        )}
                        !
                    </h3>
                    <p className="text-xs text-center font-body md:text-sm">
                        Untuk setiap teman yang membeli paket Gradient dengan
                        kode referral kamu.
                    </p>
                </article>
            </div>
            <div className="flex flex-col gap-[18px] px-[18px] md:p-0">
                <span className="inline-block text-sm font-body">
                    Bagikan Kode Referalmu
                </span>
                <div className="flex justify-between items-center px-3 py-[13px] bg-[#7264EB1A] border border-[#7264EB80] rounded-lg">
                    <span className="inline-block overflow-hidden text-base font-body whitespace-nowrap text-ellipsis">
                        {isLoading ? (
                            <Skeleton className="w-[50px] h-[10px] !m-0" />
                        ) : (
                            data?.referral_code
                        )}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="primary"
                            className="w-[80px] md:w-[105px] !p-0 !py-[7.5px] font-bold text-xs"
                            onClick={handleCopy}
                            eventName="Share Referral Button"
                            eventPayload={{
                                'Referral Code': data?.referral_code
                            }}>
                            Salin
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-[18px] px-[18px] md:p-0">
                <Menu
                    icon={<Ticket />}
                    text={`${data?.voucher_count ?? 0} Voucher Saya`}
                    handleClick={() => router.push('/referral/detail')}
                />
                <Menu
                    icon={<FaUserPlus size={22} />}
                    text={`${data?.referee_count ?? 0} Teman Terdaftar`}
                    handleClick={() =>
                        router.push('/referral/detail?open=referee')
                    }
                />
                <DisclosureTutorial
                    content={data?.config.referral_instruction as string}
                    onIsOpenChange={(isOpen) => {
                        if (isOpen) {
                            tracker?.genericTrack(
                                'Click How To User Referral Code Guide'
                            );
                        }
                    }}
                />
            </div>
        </section>
    );
};

export default ReferralContainer;
