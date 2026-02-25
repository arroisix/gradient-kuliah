import { CDN_URL } from 'commons/constants';
import Image from 'next/image';

function EmptyChart(): JSX.Element {
    return (
        <div className="w-full max-w-[256px] mx-auto">
            <div className="w-fit mx-auto mb-4">
                <Image
                    src={`${CDN_URL}/assets/utbk/dashboard/empty_chart_icon.svg`}
                    width={64}
                    height={64}
                    alt=""
                />
            </div>

            <div className="space-y-1">
                <h3 className="text-white font-semibold text-center leading-[140%]">
                    Data Belum Tersedia
                </h3>

                <p className="text-[#999999] text-center text-sm leading-[160%]">
                    Data belum tersedia saat ini, silakan cek kembali nanti.
                </p>
            </div>
        </div>
    );
}

export { EmptyChart };
