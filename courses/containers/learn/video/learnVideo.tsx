import VideoPlayer from 'commons/components/elements/Video';
import useWindowSize from 'commons/hooks/useWindowSize';

const LearnVideo = ({
    isListHidden,
    video,
    subchapterName
}: {
    isListHidden: boolean;
    video: Video;
    subchapterName: string;
}): JSX.Element => {
    const { width } = useWindowSize();

    console.log(video);

    return (
        <div className="w-full h-full">
            <VideoPlayer
                height={
                    width <= 768 ? '200px' : isListHidden ? '600px' : '450px'
                }
                video={video?.video_url}
                thumbnail={video?.thumbnail}
            />
            <div className="mt-8 px-4 md:px-0">
                <h3 className="text-2xl md:text-4xl font-bold">
                    {subchapterName}
                </h3>
                {/* <p>{video?.description}</p> */}
                <div>
                    <p className="text-neutral-600 my-4">PENGAJAR</p>
                    {video?.lecturers?.map((lecturer) => (
                        <div
                            className="w-full grid grid-colrs-1 md:grid-cols-2 gap-2"
                            key={lecturer.name}>
                            <div className="flex w-full items-center">
                                <div className="h-16 w-16 bg-neutral-200 rounded-full overflow-hidden flex justify-center items-center">
                                    <img
                                        src={lecturer.photo}
                                        height="100%"
                                        alt="lecturer"
                                    />
                                </div>
                                <div className="ml-2">
                                    <h5 className="md:text-xl text-neutral-200">
                                        {lecturer.name}
                                    </h5>
                                    <h5 className="md:text-xl font-bold">
                                        {lecturer.role}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LearnVideo;
