import { CDN_URL } from 'commons/constants';
import SearchLanding from 'dashboard/containers/searchLanding';
import Image from 'next/image';
import React from 'react';

const EmptyResult = (): JSX.Element => {
    return (
        <>
            <div className="grid p-8 place-items-center">
                <div className="flex flex-col items-center max-w-lg gap-2 text-center">
                    <div>
                        <Image
                            alt="Pencarian tidak ditemukan"
                            src={`${CDN_URL}/assets/empty-explore-community.png`}
                            width={160}
                            height={160}
                        />
                    </div>
                    <p className="font-semibold">
                        Maaf, hasil pencarian tidak ditemukan
                    </p>
                    <p className="text-sm text-graphite-400 text-pretty">
                        Gradient akan terus memperbanyak materi belajar. Pantau
                        website kami agar tidak terlewat materi baru yang
                        relevan.
                    </p>
                </div>
            </div>
            <SearchLanding isHydrate />
        </>
    );
};

export default EmptyResult;
