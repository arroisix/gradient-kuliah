import Button from 'commons/components/elements/Button';
import Link from 'next/link';
import { FaChevronLeft } from 'react-icons/fa';
import Playstore from 'commons/components/elements/Icons/Playstore';
import Appstore from 'commons/components/elements/Icons/Appstore';
import Image from 'next/image';
import { CDN_URL } from 'commons/constants';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { cn } from 'commons/utils';

const DownloadsContainer = (): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);

    return (
        <div className="w-full pt-16 lg:h-[calc(100vh-64px)] relative">
            <Link href="/kelas" className="z-10 relative">
                <Button
                    variant="secondary"
                    size="small"
                    className="flex flex-row items-center gap-[6px]">
                    <FaChevronLeft size={12} />
                    Kembali
                </Button>
            </Link>

            <div className="relative w-full h-full mt-4 flex flex-col-reverse lg:flex-row items-center justify-end lg:justify-center gap-4 lg:gap-12 px-8 lg:px-12 py-4 lg:py-8 z-10">
                <div className="flex flex-col gap-8 w-full lg:w-1/2">
                    <div className="flex flex-col gap-2">
                        <h1 className="font-bold text-2xl text-white">
                            Download Video Materi
                        </h1>

                        <h2 className="text-white">
                            Belajar dimana saja kapan saja tanpa internet.
                            Download aplikasi Gradient dan akses video materi
                            kapan saja.
                        </h2>
                    </div>

                    <div className="flex flex-row gap-3">
                        <Link
                            href="https://play.google.com/store/apps/details?id=com.gradient.academy"
                            target="_blank"
                            className="flex flex-row gap-[6px] items-center px-6 py-3 rounded-[70px] bg-[#5F2BCE] hover:bg-opacity-90">
                            <Playstore />
                            <span className="text-white font-semibold">
                                Playstore
                            </span>
                        </Link>

                        <Link
                            href="https://apps.apple.com/id/app/gradient/id6749671325"
                            target="_blank"
                            className="flex flex-row gap-[6px] items-center px-6 py-3 rounded-[70px] bg-[#5F2BCE] hover:bg-opacity-90">
                            <Appstore />
                            <span className="text-white font-semibold">
                                Appstore
                            </span>
                        </Link>
                    </div>
                </div>

                <div className="w-full lg:w-1/2">
                    <div className="w-[50%] lg:w-[80%] aspect-[377/476] relative">
                        <Image
                            src={`${CDN_URL}/assets/course-download-image.png`}
                            alt="Course Download Image"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                </div>
            </div>

            <div
                className={cn(
                    'w-full aspect-[1365/1095] absolute opacity-70 top-[238px] md:top-[228px] lg:top-16 right-[-48px] z-0',
                    isAuthenticated ? 'right-[-48px]' : 'right-[-100px]'
                )}>
                <Image
                    src={`${CDN_URL}/assets/course-download-background.png`}
                    alt="Course Download Background"
                    layout="fill"
                    objectFit="cover"
                />
            </div>
        </div>
    );
};

export default DownloadsContainer;
