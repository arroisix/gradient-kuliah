import Button from 'commons/components/elements/Button';
import { useRouter } from 'next/router';
import React from 'react';

type Props = {};

const Recommendations = (props: Props) => {
    const router = useRouter();
    const { recommendation } = router.query;

    return (
        <div className="space-y-24">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-lg font-extrabold md:text-xl">
                        Rekomendasi video
                    </h4>
                    <Button
                        href="/kelas"
                        variant="custom"
                        className="text-black bg-white">
                        Lihat Semua
                    </Button>
                </div>
                <div className="grid"></div>
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-lg font-extrabold md:text-xl">
                        Rekomendasi latihan
                    </h4>
                    <Button
                        href="/astronotes#bank-soal"
                        variant="custom"
                        className="text-black bg-white">
                        Lihat Semua
                    </Button>
                </div>
                <div className="grid"></div>
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-lg font-extrabold md:text-xl">
                        Rekomendasi rangkuman
                    </h4>
                    <Button
                        href="/astronotes"
                        variant="custom"
                        className="text-black bg-white">
                        Lihat Semua
                    </Button>
                </div>
                <div className="grid"></div>
            </div>
        </div>
    );
};

export default Recommendations;
