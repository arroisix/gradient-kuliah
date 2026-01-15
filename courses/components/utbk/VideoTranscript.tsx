import { formatDuration, transcriptTimeToSeconds } from 'commons/utils';
import { useVideoTranscriptContext } from 'courses/contexts/VideoTranscriptProvider';
import { XIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from 'react';
import { useWindowSize } from 'usehooks-ts';

interface TranscriptTimestampProps {
    currentTranscript: Transcript;
    nextTranscript: Transcript | null;
    setIsOpen: Dispatch<SetStateAction<boolean>> | null;
}

function TranscriptTimestamp({
    currentTranscript,
    nextTranscript,
    setIsOpen
}: TranscriptTimestampProps): JSX.Element {
    const router = useRouter();
    const itemRef = useRef<HTMLAnchorElement>(null);

    const { videoTimestamp } = useVideoTranscriptContext();
    const currentTimestamp = transcriptTimeToSeconds(
        currentTranscript.duration.split('-')[0]
    );

    const isCurrentTranscript = useMemo(() => {
        if (!nextTranscript) {
            return videoTimestamp >= currentTimestamp;
        }

        const nextTimestamp = transcriptTimeToSeconds(
            nextTranscript.duration.split('-')[0]
        );

        return (
            videoTimestamp >= currentTimestamp && videoTimestamp < nextTimestamp
        );
    }, [currentTimestamp, nextTranscript, videoTimestamp]);

    useEffect(() => {
        if (isCurrentTranscript && itemRef.current) {
            itemRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest'
            });
        }
    }, [isCurrentTranscript]);

    return (
        <Link
            ref={itemRef}
            href={`${router.asPath.split('?')[0]}?time=${currentTimestamp}`}
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

            <div className="flex flex-col gap-2 my-6 overflow-scroll no-scrollbar h-[calc(100vh-5em-56px-48px)] lg:h-[calc(100vh-32px-36px-16px-56px-24px-24px)]">
                {transcript?.map((value, index) => (
                    <TranscriptTimestamp
                        key={value.duration}
                        currentTranscript={value}
                        nextTranscript={
                            index < transcript.length - 1
                                ? transcript[index + 1]
                                : null
                        }
                        setIsOpen={width < 1024 ? setIsOpen : null}
                    />
                ))}
            </div>
        </div>
    );
}

export default VideoTranscript;
