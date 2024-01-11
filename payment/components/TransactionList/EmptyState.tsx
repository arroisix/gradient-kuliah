import Button from 'commons/components/elements/Button';
import { CDN_URL } from 'commons/constants';
import Image from 'next/image';
import React from 'react';

const EmptyState = (): JSX.Element => {
    return (
        <div className="w-full flex items-center justify-center flex-col min-h-[75vh]">
            <div className="w-[140px] sm:w-[248px]">
                <Image
                    src={`${CDN_URL}/assets/empty_history.png`}
                    height={992}
                    width={992}
                />
            </div>
            <p className="mt-5 mb-3 text-sm font-bold text-center sm:text-base sm:mt-6 sm:mb-4">
                Kamu belum pernah membeli paket belajar
            </p>
            <Button variant="neutral" size="small" href="/langganan">
                Beli Sekarang
            </Button>
        </div>
    );
};

export default EmptyState;
