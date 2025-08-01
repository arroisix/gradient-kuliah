import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CDN_URL } from 'commons/constants';

const DownloadBanner = (): JSX.Element => {
    return (
        <Link href="/kelas/downloads">
            <div
                className="w-full p-4 mb-6 rounded-lg"
                style={{
                    background:
                        'linear-gradient(90deg, #36236A 0%, #6A45D0 65%, #494BA0 90%)'
                }}>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            Lihat Hasil Download
                        </h3>
                        <p className="text-sm text-white/80">
                            Cek video yang kamu download di aplikasi Gradient
                        </p>
                    </div>
                    <div className="absolute top-1 right-1">
                        <Image
                            src={`${CDN_URL}/assets/video-downloads-folder.png`}
                            alt="Download Folder"
                            width={86}
                            height={56}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default DownloadBanner;
