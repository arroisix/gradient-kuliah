import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NoContentIcon from 'dashboard/assets/NoContentIcon';

const CDN_URL = 'https://assets.gradient.academy';

interface EmptyDownloadStateProps {
    title: string;
    description: string;
}

const EmptyDownloadState = ({
    title,
    description
}: EmptyDownloadStateProps): JSX.Element => {
    return (
        <div className="flex flex-col items-center justify-center py-16">
            <NoContentIcon />
            <div className="mt-8 flex flex-col items-center">
                <h3 className="text-xl font-medium text-white">{title}</h3>
                <p className="mt-2 text-sm text-gray-400">{description}</p>
            </div>
            <div className="mt-8 flex gap-4">
                <Link
                    href="#"
                    className="inline-flex items-center px-6 py-3 rounded-full gap-2 bg-[#5F2BCE] hover:bg-opacity-90 text-white">
                    <Image
                        src={`${CDN_URL}/assets/play-store-logo.png`}
                        alt="Get it on Google Play"
                        width={20}
                        height={20}
                        className="mr-2"
                    />
                    Playstore
                </Link>
                <Link
                    href="#"
                    className="inline-flex items-center px-6 py-3 rounded-full gap-2 bg-[#5F2BCE] hover:bg-opacity-90 text-white">
                    <Image
                        src={`${CDN_URL}/assets/apple-logo.png`}
                        alt="Download on the App Store"
                        width={16}
                        height={20}
                        className="mr-2"
                    />
                    Appstore
                </Link>
            </div>
        </div>
    );
};

export default EmptyDownloadState;
