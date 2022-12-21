import Button from 'commons/components/elements/Button';
import VideoPlayer from 'commons/components/elements/Video';
import Modal from 'commons/components/modules/Modal';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import Image from 'next/image';
import { useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { MdInfoOutline } from 'react-icons/md';

interface HeroPTSLProps {
    title?: string;
    tagline?: string;
    video_preview?: string;
    thumbnail?: string;
    slug: string;
}

const VideoPreview = ({
    isOpen,
    setOpen,
    video_preview,
    thumbnail
}: {
    isOpen: boolean;
    setOpen: (status: boolean) => void;
    video_preview: string;
    thumbnail: string;
}): JSX.Element => {
    return (
        <Modal
            isOpen={isOpen ? 1 : 0}
            setOpen={(status: number) => setOpen(status === 1)}
            isPopup
            variant="dark"
            className="w-[100vw] lg:w-[60vw] flex justify-center items-center">
            <VideoPlayer
                height="100%"
                video={video_preview}
                thumbnail={thumbnail}
            />
        </Modal>
    );
};

const HeroPTSLSection = ({
    title,
    tagline,
    video_preview,
    thumbnail,
    slug
}: HeroPTSLProps): JSX.Element => {
    const { is_subscribed, expiryDay, latest_subchapter } =
        useCourseSubscription(slug);
    const [showVideoPreview, setVideoPreview] = useState(false);

    return (
        <section className="h-screen w-full flex flex-col-reverse md:flex-row justify-end md:justify-center relative md:min-h-[1000px]">
            <div className="w-full h-screen flex flex-col justify-end md:justify-center pl-4 pr-4 md:pr-0 md:pl-[7.5rem] py-4 mb-8 md:mb-0 md:min-h-[1000px]">
                {!is_subscribed ? (
                    <div className="z-10 w-full lg:w-[40vw]">
                        <h1 className="text-4xl md:text-5xl font-bold">
                            {title}
                        </h1>
                        <div className="w-full my-4">
                            <p>{tagline}</p>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-full md:max-w-[30vw] z-10">
                        <h4 className="text-base font-bold md:text-3xl">
                            {title}
                        </h4>
                        <div className="h-px bg-neutral-800 my-4" />
                        <p className="text-base text-neutral-400">
                            TERAKHIR DIPELAJARI
                        </p>
                        <h3 className="text-2xl md:text-3xl">
                            {latest_subchapter?.subchapter.subchapter_name ??
                                'Belum ada progress belajar'}
                        </h3>
                    </div>
                )}
                {is_subscribed ? (
                    <Button
                        className="md:w-fit text-center mt-4 z-10"
                        variant="primary"
                        href={`/#learning-catalog`}>
                        Lanjut Belajar
                    </Button>
                ) : (
                    <Button
                        className="md:w-fit text-center mt-4 z-10"
                        variant="primary"
                        href={`/kelas/${slug}#benefit`}>
                        Info Selengkapnya
                    </Button>
                )}
                {is_subscribed &&
                    (expiryDay <= 7 || new Date() <= new Date('2022-10-14')) &&
                    expiryDay < 30 && (
                        <div className="flex mt-2 items-center gap-2 z-10">
                            <MdInfoOutline className="text-xl" />
                            <h4 className="font-body">
                                Waktu berlanggangan kamu akan segera habis dalam{' '}
                                {expiryDay} hari
                            </h4>
                        </div>
                    )}
            </div>
            <div
                className="hidden md:flex h-screen mt-16 md:mt-0 overflow-hidden absolute top-0 right-0 md:min-h-[1000px]"
                onClick={() => setVideoPreview(true)}
                aria-hidden>
                <div className="relative">
                    <div className="object-contain h-screen w-[60vw]">
                        {thumbnail && (
                            <Image
                                src={thumbnail}
                                className="object-cover"
                                layout="fill"
                                height={1000}
                                width={600}
                            />
                        )}
                    </div>
                    <FaPlay className="text-5xl absolute top-[50%] left-[45%] cursor-pointer" />
                    <div
                        className="h-[105vh] w-[10vw] bg-black absolute -left-32 -top-2"
                        style={{ filter: 'blur(4px)' }}
                    />
                </div>
            </div>
            <div
                className="flex md:hidden h-screen w-screen mt-16 overflow-hidden absolute top-0 left-0"
                onClick={() => setVideoPreview(true)}
                aria-hidden>
                <div className="relative">
                    <div className="w-screen max-h-[80vh] overflow-hidden">
                        {thumbnail && (
                            <Image
                                className="object-cover"
                                src={thumbnail}
                                layout="responsive"
                                height={800}
                                width={600}
                            />
                        )}
                    </div>
                    <FaPlay className="text-5xl absolute top-[40%] left-[45%] cursor-pointer" />
                    <div
                        className="h-[15vh] w-[105vw] bg-black absolute bottom-24 -left-2"
                        style={{ filter: 'blur(4px)' }}
                    />
                </div>
            </div>
            {showVideoPreview && (
                <VideoPreview
                    setOpen={setVideoPreview}
                    isOpen={showVideoPreview}
                    video_preview={video_preview as string}
                    thumbnail={thumbnail as string}
                />
            )}
        </section>
    );
};

export default HeroPTSLSection;
