import Button from 'commons/components/elements/Button';
import { CDN_URL } from 'commons/constants';
import { cn } from 'commons/utils';
import Image from 'next/image';

function EmptyPassingGrade(): JSX.Element {
    return (
        <div
            className={cn(
                'bg-[#20222E] rounded-lg p-4 flex flex-col justify-between gap-8',
                'lg:w-full lg:max-w-[369px] lg:px-6'
            )}>
            <div className={cn('grid place-items-center space-y-3', 'lg:mt-6')}>
                <Image
                    src={`${CDN_URL}/assets/utbk/dashboard/empty_passing_grade.svg`}
                    width={64}
                    height={64}
                    alt=""
                />

                <div className="text-center space-y-1">
                    <h3 className="text-white font-semibold leading-[140%]">
                        Data Passing Grade Belum Tersedia
                    </h3>

                    <p className="text-[#999999] text-sm leading-[160%]">
                        Data passing grade belum tersedia saat ini. Silakan
                        pilih jurusan lain atau cek kembali nanti.
                    </p>
                </div>
            </div>

            <Button
                type="button"
                variant="primary"
                className="!py-2 !px-4 text-white text-sm leading-tight font-semibold w-fit mx-auto">
                Pilih Jurusan Lain
            </Button>
        </div>
    );
}

export { EmptyPassingGrade };
