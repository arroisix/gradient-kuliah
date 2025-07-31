import WhiteGradientGIcon from 'commons/components/elements/Icons/WhiteGradientGIcon';
import { CDN_URL } from 'commons/constants';
import Image from 'next/image';
import { TbArrowsLeftRight } from 'react-icons/tb';

const AuthenticateCreditCardContainer = (): JSX.Element => {
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
                                    src={`${CDN_URL}/assets/payments/mastercard.png`}
                                    alt="Mastercard Logo"
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
