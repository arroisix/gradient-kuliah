import VideoPlayer from 'src/commons/components/elements/Video';

const LearnVideo = ({
    isListHidden,
    video,
    subchapterName
}: {
    isListHidden: boolean;
    video: Video;
    subchapterName: string;
}): JSX.Element => {
    return (
        <div className="w-full h-full">
            <VideoPlayer
                height={isListHidden ? '600px' : '450px'}
                video={video?.videoUrl}
                thumbnail={video?.thumbnail}
            />
            <div className="mt-8">
                <h3 className="text-4xl font-bold">{subchapterName}</h3>
                <p>{video?.description}</p>
                <div className="">
                    <p className="text-neutral-600 my-4">PENGAJAR</p>
                    {video.lecturers?.map((lecturer) => (
                        <div
                            className="w-full grid grid-cols-2 gap-2"
                            key={lecturer.name}>
                            <div className="flex w-full items-center">
                                <div className="h-16 w-16 bg-neutral-200 rounded-full"></div>
                                <div className="ml-2">
                                    <h5 className="text-xl text-neutral-200">
                                        {lecturer.name}
                                    </h5>
                                    <h5 className="text-xl">{lecturer.role}</h5>
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
