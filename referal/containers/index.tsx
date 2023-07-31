import Button from 'commons/components/elements/Button';
import Coin from 'commons/components/elements/Icons/Coin';
import Ticket from 'commons/components/elements/Icons/Ticket';
import Skeleton from 'commons/components/elements/Skeleton';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import DisclosureTutorial from 'referal/components/DisclosureTutorial';
import Menu from 'referal/components/Menu';
import { useGetReferralQuery } from 'referal/redux/referalApi';

const ReferalContainer = (): JSX.Element => {
    const router = useRouter();
    const [showTooltips, setShowtooltips] = useState(false);

    const { data, isLoading } = useGetReferralQuery();

    function handleCopy(): void {
        navigator.clipboard.writeText(data?.referral_code ?? '');
        setShowtooltips(true);
        setTimeout(() => {
            setShowtooltips(false);
        }, 1000);
    }

    return (
        <section className="flex flex-col gap-6 w-full md:w-[70%] max-w-[725px] mx-auto pt-[96px]">
            <h2 className="font-extrabold text-center text-base md:text-2xl">
                Kode Referral
            </h2>
            <div className="flex flex-col gap-7 px-12 md:px-[60px] py-7 bg-[#5F2BCE] md:rounded-xl">
                <Coin className="mx-auto" />
                <article className="flex flex-col gap-[10px]">
                    <h3 className="font-extrabold text-center text-xs md:text-base">
                        Ajak Teman ke Gradient. Dapat Voucher Cashback!
                    </h3>
                    <p className="font-body text-center text-xs md:text-sm">
                        Dapatkan voucher cashback senilai Rp25,000 untuk setiap
                        teman yang mendaftar dan mulai kelas pertamanya di
                        Gradient menggunakan kode referal kamu.[API]
                    </p>
                </article>
            </div>
            <div className="flex flex-col gap-[18px] px-[18px] md:p-0">
                <span className="inline-block font-body text-sm">
                    Bagikan Kode Referalmu
                </span>
                <div className="flex justify-between items-center px-3 py-[13px] bg-[#7264EB1A] border border-[#7264EB80] rounded-lg">
                    <span className="inline-block font-body text-base whitespace-nowrap text-ellipsis overflow-hidden">
                        {isLoading ? (
                            <Skeleton className="w-[50px] h-[10px] !m-0" />
                        ) : (
                            data?.referral_code
                        )}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="custom"
                            className="relative w-[80px] md:w-[105px] !p-0 !py-[7.5px] font-bold text-xs bg-[#272727]"
                            onClick={handleCopy}>
                            <>
                                Salin
                                <div
                                    className={`${
                                        !showTooltips && 'hidden'
                                    } absolute top-[-35px] left-[50%] translate-x-[-50%] px-3 py-1 bg-[#212121] rounded-[2px] font-body font-normal text-sm`}>
                                    Tersalin
                                </div>
                            </>
                        </Button>
                        <Button
                            variant="primary"
                            className="w-[80px] md:w-[105px] !p-0 !py-[7.5px] font-bold text-xs">
                            Bagikan
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-[18px] px-[18px] md:p-0">
                <Menu
                    icon={<Ticket />}
                    text={`${data?.voucher_count ?? 0} Voucher Saya`}
                    handleClick={() => router.push('/referal/detail')}
                />
                <Menu
                    icon={<FaUserPlus size={22} />}
                    text={`${data?.referee_count ?? 0} Teman Terdaftar`}
                    handleClick={() =>
                        router.push('/referal/detail?open=referee')
                    }
                />
                <DisclosureTutorial
                    content={data?.config.referral_instruction as string}
                />
            </div>
        </section>
    );
};

export default ReferalContainer;
