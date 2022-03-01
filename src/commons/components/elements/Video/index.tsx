import { MdOutlinePlayCircleFilled } from 'react-icons/md';
import ReactPlayer from 'react-player';

const VideoPlayer = ({
    video,
    thumbnail,
    height
}: {
    video: string;
    thumbnail: string;
    height?: string;
}): JSX.Element => {
    return (
        <div className="relative flex flex-col items-center justify-center">
            <ReactPlayer
                url={video}
                controls
                config={{
                    file: {
                        attributes: {
                            controlsList: 'nodownload'
                        }
                    }
                }}
                width={'100%'}
                height={height ? height : '500px'}
                playing
                playIcon={<MdOutlinePlayCircleFilled className="text-7xl" />}
                light={thumbnail}
            />
        </div>
    );
};

export default VideoPlayer;
