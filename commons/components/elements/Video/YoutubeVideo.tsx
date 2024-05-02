import { useLearning } from 'courses/contexts/LearningProvider';
import React, { useState, useEffect, useRef } from 'react';

const YoutubeVideo = ({ src }: { src: string }): JSX.Element => {
    const [load, setLoad] = useState(false);
    const videoRef = useRef<HTMLDivElement>(null);
    const { subchapter } = useLearning();

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setLoad(true);
                observer.disconnect();
            }
        });

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    return (
        <div ref={videoRef}>
            {load ? (
                <iframe
                    width="100%"
                    height="500"
                    src={src}
                    title={subchapter?.subchapter_name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen></iframe>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default YoutubeVideo;
