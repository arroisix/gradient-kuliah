import Skeleton from 'commons/components/elements/Skeleton';
import Spinner from 'commons/components/elements/Spinner';
import useElementSize from 'commons/hooks/useElementSize';
import useOnScreen from 'commons/hooks/useOnScreen';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import useWindowSize from 'commons/hooks/useWindowSize';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Avatar from 'react-avatar';
import { HiClock } from 'react-icons/hi';
import {
    useGetRefereeQuery,
    useGetVoucherQuery
} from 'referal/redux/referalApi';

const arrMonth = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

const MyVoucher = (): JSX.Element => {
    const [page, setPage] = useState(1);
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const { width } = useWindowSize();
    const { width: voucherWidth, ref: voucherRef } =
        useElementSize<HTMLDivElement>();
    const anchor = useRef({} as HTMLDivElement);
    const isAnchorOnScreen = useOnScreen(anchor);
    const { data, isLoading, isFetching } = useGetVoucherQuery({ page });

    useEffect(() => {
        if (
            data?.next_page !== null &&
            data?.next_page !== undefined &&
            isAnchorOnScreen &&
            !isLoading &&
            !isFetching
        ) {
            setPage(data.next_page);
        }
    }, [isAnchorOnScreen]);

    return (
        <div className="flex flex-col gap-[18px] md:gap-6">
            {isLoading && (
                <>
                    <Skeleton className="h-[140px] !m-0" />
                    <Skeleton className="h-[140px] !m-0" />
                </>
            )}
            {data && !isLoading && data?.vouchers?.length !== 0 ? (
                <>
                    {data?.vouchers?.map(({ id, code, expired_at, label }) => {
                        const [showTooltips, setShowtooltips] = useState(false);

                        function handleCopy(): void {
                            navigator.clipboard.writeText(code);
                            setShowtooltips(true);
                            setTimeout(() => {
                                setShowtooltips(false);
                            }, 1000);
                        }
                        return (
                            <div
                                key={id}
                                className="relative max-h-[170px] flex flex-col"
                                style={{
                                    height: isMobileBreakpoints
                                        ? (width * 23) / 100
                                        : (width * 16) / 100
                                }}
                                ref={voucherRef}>
                                <Image
                                    src={
                                        'https://assets.gradient.academy/assets/voucher-bg.png'
                                    }
                                    alt="voucher-bg"
                                    layout="fill"
                                    sizes="none"
                                    className="object-contain"
                                    loading="lazy"
                                />
                                <div className="flex flex-col gap-2 sm:gap-3 absolute top-[50%] left-4 md:left-8 translate-y-[-50%]">
                                    <span
                                        className="inline-block font-extrabold leading-none"
                                        style={{
                                            fontSize: isMobileBreakpoints
                                                ? (voucherWidth * 5) / 100
                                                : (voucherWidth * 3.5) / 100
                                        }}>
                                        {label}
                                    </span>
                                    <div className="flex items-center gap-[6px]">
                                        <HiClock />
                                        <span
                                            className="inline-block font-body leading-none"
                                            style={{
                                                fontSize: isMobileBreakpoints
                                                    ? (voucherWidth * 3.5) / 100
                                                    : (voucherWidth * 2) / 100
                                            }}>
                                            {`Valid till ${`${new Date(
                                                expired_at
                                            ).getDate()}`.padStart(2, '0')} ${
                                                arrMonth[
                                                    new Date(
                                                        expired_at
                                                    ).getMonth()
                                                ]
                                            } ${new Date(
                                                expired_at
                                            ).getFullYear()}`}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className="flex flex-col absolute top-[50%] translate-y-[-50%]"
                                    style={{
                                        left: (voucherWidth * 66) / 100,
                                        gap: (voucherWidth * 3.5) / 100
                                    }}>
                                    <div
                                        className="flex flex-col"
                                        style={{
                                            gap: (voucherWidth * 2) / 100
                                        }}>
                                        <span
                                            className="inline-block font-body font-bold text-[#FFFFFF80] leading-none"
                                            style={{
                                                fontSize: isMobileBreakpoints
                                                    ? (voucherWidth * 3.5) / 100
                                                    : (voucherWidth * 3) / 100
                                            }}>
                                            Kode Voucher
                                        </span>
                                        <span
                                            className="inline-block font-body font-bold leading-none"
                                            style={{
                                                fontSize: isMobileBreakpoints
                                                    ? (voucherWidth * 3.5) / 100
                                                    : (voucherWidth * 3) / 100
                                            }}>
                                            {code}
                                        </span>
                                    </div>
                                    <button
                                        className="relative w-max bg-white text-black leading-none font-bold px-3 py-1 md:px-6 md:py-2 rounded-[70px]"
                                        style={{
                                            fontSize: isMobileBreakpoints
                                                ? (voucherWidth * 2.5) / 100
                                                : (voucherWidth * 1.6) / 100
                                        }}
                                        onClick={handleCopy}>
                                        <>
                                            Salin Kode
                                            <div
                                                className={`${
                                                    !showTooltips && 'hidden'
                                                } absolute top-[-35px] left-[50%] translate-x-[-50%] px-3 py-1 bg-[#212121] rounded-[2px] font-body font-normal text-white text-sm`}>
                                                Tersalin
                                            </div>
                                        </>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {isFetching && <Spinner size="small" />}
                </>
            ) : (
                <div className="flex flex-col gap-6 pt-[80px]">
                    <div className="relative h-[200px] md:h-[250px]">
                        <Image
                            src={
                                'https://assets.gradient.academy/assets/empty-voucher.png'
                            }
                            alt="empty-voucher"
                            layout="fill"
                            sizes="none"
                            className="object-contain"
                            loading="lazy"
                        />
                    </div>
                    <span className="inline-block w-full font-extrabold text-center text-sm md:text-base">
                        Belum ada voucher
                    </span>
                </div>
            )}
            <div ref={anchor} className="w-full h-0" />
        </div>
    );
};

const ListReferee = (): JSX.Element => {
    const [page, setPage] = useState(1);
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const anchor = useRef({} as HTMLDivElement);
    const isAnchorOnScreen = useOnScreen(anchor);
    const { data, isLoading, isFetching } = useGetRefereeQuery({ page });

    useEffect(() => {
        if (
            data?.next_page !== null &&
            data?.next_page !== undefined &&
            isAnchorOnScreen &&
            !isLoading &&
            !isFetching
        ) {
            setPage(data.next_page);
        }
    }, [isAnchorOnScreen]);

    return (
        <>
            {data && data?.referees?.length !== 0 ? (
                <div className="flex flex-col gap-6 px-0 py-6 md:p-6 rounded-xl md:bg-[#121212]">
                    {isLoading && (
                        <>
                            <Skeleton className="h-[40px] !m-0" />
                            <Skeleton className="h-[40px] !m-0" />
                            <Skeleton className="h-[40px] !m-0" />
                        </>
                    )}
                    <>
                        {data?.referees?.map(
                            (
                                { id, photo_url, full_name, referred_at },
                                index
                            ) => (
                                <div
                                    key={id}
                                    className="flex justify-between items-center">
                                    <div className="flex items-center gap-6">
                                        <span className="inline-block font-body text-[#666666] text-sm md:text-base">
                                            {index + 1}
                                        </span>
                                        <div className="flex items-center gap-[14px]">
                                            {!!photo_url ? (
                                                <div className="w-[24px] md:w-[32px] h-[24px] md:h-[32px] relative">
                                                    <Image
                                                        src={photo_url}
                                                        alt="photo-profile"
                                                        layout="fill"
                                                        className="rounded-full"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            ) : isMobileBreakpoints ? (
                                                <Avatar
                                                    name={full_name}
                                                    size="24"
                                                    round
                                                />
                                            ) : (
                                                <Avatar
                                                    name={full_name}
                                                    size="32"
                                                    round
                                                />
                                            )}
                                            <span className="inline-block font-extrabold text-sm md:text-base">
                                                {full_name}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="inline-block font-body text-xs md:text-sm">
                                        {referred_at}
                                    </span>
                                </div>
                            )
                        )}
                        {true && <Spinner size="small" />}
                    </>
                </div>
            ) : (
                <div className="flex flex-col gap-6 pt-[80px]">
                    <div className="relative h-[200px] md:h-[250px]">
                        <Image
                            src={
                                'https://assets.gradient.academy/assets/empty-referee.png'
                            }
                            alt="empty-referee"
                            layout="fill"
                            sizes="none"
                            className="object-contain"
                            loading="lazy"
                        />
                    </div>
                    <span className="inline-block w-full font-extrabold text-center text-sm md:text-base">
                        Belum ada voucher
                    </span>
                </div>
            )}
            <div ref={anchor} className="w-full h-0" />
        </>
    );
};

const ReferalDetailContainer = (): JSX.Element => {
    const [navigation, setNavigation] = useState<'MY_VOUCHER' | 'REFEREE'>(
        'MY_VOUCHER'
    );

    const router = useRouter();

    useEffect(() => {
        const { open } = router.query;
        if (open === 'referee') {
            setNavigation('REFEREE');
        }
    }, [router]);

    return (
        <section className="flex flex-col gap-6 w-full md:w-[70%] max-w-[725px] mx-auto pt-[96px] px-[18px]">
            <div className="w-full flex">
                <span
                    className={`inline-block w-full pb-[6px] font-bold text-center text-xs md:text-base border-b-2 cursor-pointer ${
                        navigation === 'MY_VOUCHER'
                            ? 'border-accent-purple'
                            : 'text-neutral-600 border-[#242424]'
                    }`}
                    onClick={() => setNavigation('MY_VOUCHER')}
                    aria-hidden>
                    VOUCHER SAYA
                </span>
                <span
                    className={`inline-block w-full pb-[6px] font-bold text-center text-xs md:text-base border-b-2 cursor-pointer ${
                        navigation === 'REFEREE'
                            ? 'border-accent-purple'
                            : 'text-neutral-600 border-[#242424]'
                    }`}
                    onClick={() => setNavigation('REFEREE')}
                    aria-hidden>
                    TEMAN TERDAFTAR
                </span>
            </div>
            {navigation === 'MY_VOUCHER' && <MyVoucher />}
            {navigation === 'REFEREE' && <ListReferee />}
            <div></div>
        </section>
    );
};

export default ReferalDetailContainer;
