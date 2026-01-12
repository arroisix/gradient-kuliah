import { formatDuration, transcriptTimeToSeconds } from 'commons/utils';
import { useVideoTranscriptContext } from 'courses/contexts/VideoTranscriptProvider';
import { XIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';
import { useWindowSize } from 'usehooks-ts';

interface TranscriptTimestampProps {
    currentTranscript: Transcript;
    setIsOpen: Dispatch<SetStateAction<boolean>> | null;
}

function TranscriptTimestamp({
    currentTranscript,
    setIsOpen
}: TranscriptTimestampProps): JSX.Element {
    const { videoTimestamp } = useVideoTranscriptContext();
    const router = useRouter();

    const currentTranscriptTime = transcriptTimeToSeconds(
        currentTranscript.duration.split('-')[0]
    );

    const [startTimestamp, endTimestamp] = currentTranscript.duration
        .split('-')
        .map((v) => transcriptTimeToSeconds(v));

    const isCurrentTranscript =
        videoTimestamp >= startTimestamp && videoTimestamp < endTimestamp;

    const url = `${router.asPath.split('?')[0]}?time=${currentTranscriptTime}`;

    return (
        <Link
            href={url}
            onClick={() => setIsOpen && setIsOpen(false)}
            className={`${
                isCurrentTranscript ? 'bg-[#36236A]' : ''
            } hover:bg-[#2C2C2C] transition-all duration-300 flex gap-3 p-3 rounded-lg h-full lg:items-center`}>
            <span
                className={`${
                    isCurrentTranscript ? 'text-white' : 'text-[#B6A6F3]'
                } font-semibold text-sm w-[42px]`}>
                {formatDuration(currentTranscript.duration.split('-')[0])}
            </span>

            <span
                className={`${
                    isCurrentTranscript ? 'font-semibold' : ''
                } text-white text-sm`}>
                {currentTranscript.content}
            </span>
        </Link>
    );
}

interface VideoTranscriptProps {
    transcript?: Transcript[];
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function VideoTranscript({
    transcript,
    setIsOpen
}: VideoTranscriptProps): JSX.Element {
    const { width } = useWindowSize();
    return (
        <div className="bg-[#101010] pb-6">
            <div className="bg-[#2C2C2C] flex justify-between items-center p-4">
                <h3 className="text-white font-semibold text-sm">
                    Transcript Video
                </h3>

                <button type="button" onClick={() => setIsOpen(false)}>
                    <XIcon className="text-white w-6 h-6" />
                    <span className="sr-only">Close Transcript</span>
                </button>
            </div>

            <div className="flex flex-col gap-2 mt-6 lg:h-[calc(100vh-32px-36px-16px-56px-24px-24px)] lg:overflow-scroll">
                {transcript?.map((value) => (
                    <TranscriptTimestamp
                        key={value.duration}
                        setIsOpen={width < 1024 ? setIsOpen : null}
                        currentTranscript={value}
                    />
                ))}
            </div>
        </div>
    );
}

export default VideoTranscript;
