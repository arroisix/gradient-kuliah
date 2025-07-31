import WhiteGradientGIcon from 'commons/components/elements/Icons/WhiteGradientGIcon';
import Skeleton from 'commons/components/elements/Skeleton';
import { CDN_URL } from 'commons/constants';
import Image from 'next/image';
import { useGetUserCardQuery } from 'payment/redux/api/transactionApi';
import { TbArrowsLeftRight } from 'react-icons/tb';

const AuthenticateCreditCardContainer = ({
    trx
}: {
    trx: Transaction;
}): JSX.Element => {
    if (!trx.user_card_id) {
        return <Skeleton repeat={1} />;
    }

    const { data: card, isLoading } = useGetUserCardQuery(trx.user_card_id);

    if (isLoading || !card) {
        return <Skeleton repeat={1} />;
    }

    return (
        <div className="flex flex-col items-center space-y-4 justify-center fixed inset-0">
            <div className="relative">
                <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center shadow border border-graphite-600">
                        <WhiteGradientGIcon />
                    </div>

                    <div className="w-24 h-24 rounded-full flex items-center justify-center shadow border border-graphite-600">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white">
                            <div className="relative w-10 h-10">
                                <Image
                                    src={`${CDN_URL}/assets/payments/${trx.payment_method
                                        .substring('CARD_'.length)
                                        .toLowerCase()}.png`}
                                    alt={`${trx.payment_method}`}
                                    layout="fill"
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                    <TbArrowsLeftRight className="text-white" size={24} />
                </div>
            </div>

            <span className="text-center text-lg font-bold text-white">
                Kamu akan diarahkan ke halaman verifikasi
            </span>
        </div>
    );
};

export default AuthenticateCreditCardContainer;
