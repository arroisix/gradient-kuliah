import Button from 'src/commons/components/elements/Button';
import ReactPlayer from 'react-player';
import { MdCopyright, MdOutlinePlayCircleFilled } from 'react-icons/md';
import useWindowSize from 'src/commons/hooks/useWindowSize';
import { trackGAEvent } from 'src/commons/analytics';

const Hero = (): JSX.Element => {
    const { width } = useWindowSize();
    return (
        <section className="h-screen w-full px-8 md:px-[7.5rem] py-4 flex flex-col justify-center items-center relative">
            <h1 className="text-2xl md:text-5xl font-bold text-center w-full md:w-[40rem] z-10">
                Belajar dengan pengajar terbaik di seluruh Indonesia
            </h1>
            <div className="w-screen h-screen absolute flex justify-center items-center">
                <div className="hero-blur-red mr-[15vw]" />
                <div className="hero-blur-blue" />
            </div>
            <div className="z-50 my-8 w-[250px] md:w-[500px]">
                <ReactPlayer
                    url="https://d2uqn6ndx4ow3t.cloudfront.net/courses/intro-sipil/videos/ftsl-trailer.mp4"
                    controls
                    width={width > 768 ? '500px' : '250px'}
                    height={width > 768 ? '280px' : '150px'}
                    playing
                    onStart={() => trackGAEvent('play_trailer')}
                    onPause={() => trackGAEvent('pause_trailer')}
                    onEnded={() => trackGAEvent('finish_watch_trailer')}
                    onBuffer={() => trackGAEvent('video_buffering')}
                    playIcon={
                        <MdOutlinePlayCircleFilled className="text-7xl" />
                    }
                    light="https://d2uqn6ndx4ow3t.cloudfront.net/courses/intro-sipil/assets/hero_asih.jpg"
                />
            </div>
            <div className="w-full md:w-1/2 text-center z-10 mb-4">
                <span className="text-neutral-300">
                    Menyediakan materi belajar yang berkualitas dan video
                    belajar yang gak ngebosenin untuk kamu.
                </span>
            </div>
            <Button variant="primary">COMING SOON</Button>
            <footer className="absolute bottom-0 left-0 w-screen p-8 flex justify-center items-center">
                <h1 className="flex items-center">
                    <MdCopyright className="mr-2" /> Gradient 2022
                </h1>
            </footer>
        </section>
    );
};

export default Hero;
