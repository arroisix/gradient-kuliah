import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { MdOutlinePlayCircleFilled } from 'react-icons/md';
import ReactPlayer from 'react-player';
import useOnScreen from 'src/commons/hooks/useOnScreen';

const MobileValueProposition = (): JSX.Element => {
    return (
        <>
            <div className="flex flex-col-reverse md:hidden w-full mb-8">
                <div className="w-full flex items-center justify-center">
                    <h3 className="text-2xl text-neutral-600 font-bold p-4">
                        <span className="text-white">
                            Belajar Tidak Harus Membosankan.
                        </span>{' '}
                        Terkurasi agar mudah dipahami dan menarik.
                    </h3>
                </div>
                <div className="w-full h-[50vh] sticky-card sticky-1 p-4">
                    <div className="w-full h-full flex justify-center items-center">
                        <div className="w-full h-full overflow-hidden">
                            <ReactPlayer
                                url={
                                    'https://d2uqn6ndx4ow3t.cloudfront.net/assets/landing-page.mp4'
                                }
                                controls
                                config={{
                                    file: {
                                        attributes: {
                                            controlsList: 'nodownload'
                                        }
                                    }
                                }}
                                width="100%"
                                height="100%"
                                playIcon={
                                    <MdOutlinePlayCircleFilled className="text-7xl" />
                                }
                                light={
                                    'https://d2uqn6ndx4ow3t.cloudfront.net/assets/landing-page-thumb.png'
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col-reverse md:hidden w-full mb-8">
                <div className="w-full flex items-center justify-center p-4">
                    <h3 className="text-2xl text-neutral-600 font-bold">
                        <span className="text-white">Harga Terjangkau.</span>{' '}
                        Supaya semua orang punya kesempatan.
                    </h3>
                </div>
                <div className="w-full h-[50vh] sticky-card sticky-2">
                    <div className="w-full h-full flex justify-center items-center">
                        <img
                            src="https://d2uqn6ndx4ow3t.cloudfront.net/assets/landing-page.gif"
                            alt="gif"
                            height="100%"
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col-reverse md:hidden w-full mb-8">
                <div className="w-full flex items-center justify-center  p-4">
                    <h3 className="text-2xl text-neutral-600 font-bold">
                        <span className="text-white">
                            Artikel, Materi, dan Latihan.
                        </span>{' '}
                        Lengkap dalam 1 platform.
                    </h3>
                </div>
                <div className="w-full h-[50vh] sticky-card sticky-3">
                    <div className="w-full h-full flex justify-center items-center">
                        <img
                            src="https://d2uqn6ndx4ow3t.cloudfront.net/assets/landing-page-new.png"
                            alt="png"
                            height="100%"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

const StickyVariants = {
    sticky1: {
        background:
            'linear-gradient(223.86deg,#7264eb 2.16%,#5925c8 34.38%,#c83325 64.12%,#f3887e 97.34%)'
    },
    sticky2: {
        background:
            'linear-gradient(43.82deg,#cbc6f9 0%,#733fe1 33.85%,#df5446 65.09%,#ffada5 100%)'
    },
    sticky3: {
        background:
            'linear-gradient(43.82deg,#cac7e4 0%,#ab8eec 28.4%,#dd837a 65.1%,#ecd0cd 100%)'
    }
};

const StickyContent: { [key: string]: JSX.Element } = {
    sticky1: (
        <div className="w-full h-full flex justify-center items-center">
            <div className="w-[40vw] h-[65vh] overflow-hidden">
                <ReactPlayer
                    url={
                        'https://d2uqn6ndx4ow3t.cloudfront.net/assets/landing-page.mp4'
                    }
                    controls
                    config={{
                        file: {
                            attributes: {
                                controlsList: 'nodownload'
                            }
                        }
                    }}
                    width="100%"
                    height="100%"
                    playIcon={
                        <MdOutlinePlayCircleFilled className="text-7xl" />
                    }
                    light={
                        'https://d2uqn6ndx4ow3t.cloudfront.net/assets/landing-page-thumb.png'
                    }
                />
            </div>
        </div>
    ),
    sticky2: (
        <div className="w-full h-full flex justify-center items-center">
            <img
                src="https://d2uqn6ndx4ow3t.cloudfront.net/assets/landing-page.gif"
                alt="gif"
                height="100%"
            />
        </div>
    ),
    sticky3: (
        <div className="w-full h-full flex justify-center items-center">
            <img
                src="https://d2uqn6ndx4ow3t.cloudfront.net/assets/landing-page-new.png"
                alt="png"
                height="100%"
            />
        </div>
    )
};

const ValueProposition = (): JSX.Element => {
    const firstAnchor = useRef({} as HTMLDivElement);
    const secondAnchor = useRef({} as HTMLDivElement);
    const thirdAnchor = useRef({} as HTMLDivElement);

    const isFirstSeen = useOnScreen(firstAnchor);
    const isSecondSeen = useOnScreen(secondAnchor);
    const isThirdSeen = useOnScreen(thirdAnchor);

    const [renderedClass, setRenderedClass] = useState('sticky1');

    useEffect(() => {
        if (isFirstSeen) {
            setRenderedClass('sticky1');
        }
    }, [isFirstSeen]);

    useEffect(() => {
        if (isSecondSeen) {
            setRenderedClass('sticky2');
        }
    }, [isSecondSeen]);

    useEffect(() => {
        if (isThirdSeen) {
            setRenderedClass('sticky3');
        }
    }, [isThirdSeen]);

    return (
        <>
            <div
                className="hidden md:flex w-full"
                style={{ height: 'calc(300vh - 12rem)' }}>
                <div className="w-[50vw] h-full">
                    <div className="h-1/3 relative">
                        <div
                            className="absolute top-32 left-0"
                            ref={firstAnchor}
                        />
                        <div className="w-full h-full flex items-center justify-center">
                            <h3 className="text-4xl text-neutral-600 font-bold p-[7.25rem]">
                                <span className="text-white">
                                    Belajar Tidak Harus Membosankan.
                                </span>{' '}
                                Terkurasi agar mudah dipahami dan menarik.
                            </h3>
                        </div>
                    </div>
                    <div className="h-1/3 relative">
                        <div
                            className="absolute top-32 left-0"
                            ref={secondAnchor}
                        />
                        <div className="w-full h-full flex items-center justify-center p-[7.25rem]">
                            <h3 className="text-4xl text-neutral-600 font-bold">
                                <span className="text-white">
                                    Harga Terjangkau.
                                </span>{' '}
                                Supaya semua orang punya kesempatan.
                            </h3>
                        </div>
                    </div>
                    <div className="h-1/3 relative">
                        <div className="w-full h-full flex items-center justify-center p-[7.25rem]">
                            <h3 className="text-4xl text-neutral-600 font-bold">
                                <span className="text-white">
                                    Artikel, Materi, dan Latihan.
                                </span>{' '}
                                Lengkap dalam 1 platform.
                            </h3>
                        </div>
                        <div
                            className="absolute top-32 left-0"
                            ref={thirdAnchor}
                        />
                    </div>
                </div>
                <motion.div
                    className={`w-1/2 sticky top-16 ${renderedClass} p-16`}
                    transition={{ type: 'tween' }}
                    variants={StickyVariants}
                    initial="sticky1"
                    animate={renderedClass}
                    style={{
                        height: 'calc(100vh - 64px)'
                    }}>
                    {StickyContent[renderedClass]}
                </motion.div>
            </div>
            <MobileValueProposition />
        </>
    );
};

export default ValueProposition;
