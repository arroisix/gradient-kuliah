import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import LearnContentBox from 'courses/components/LearnContentBox';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetSubchapterDetailQuery } from 'courses/redux/api/privateCourseApi';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import LearnVideo from './learnVideo';

const VideoLearnContainer = ({
    chapters
}: {
    chapters: Chapter[];
}): JSX.Element => {
    const router = useRouter();
    const { sub, id } = router.query;
    const isAuthenticated = useSelector(getIsAuthenticated);
    const {
        is_subscribed,
        learning_progress_id,
        latest_subchapter,
        subchapter_progress
    } = useCourseSubscription(id as string);
    const { data, isLoading } = useGetSubchapterDetailQuery(sub as string, {
        skip: sub === null || sub === undefined || !isAuthenticated
    });
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const [showMaterial, setShowMaterial] = useState(false);

    return (
        <section className="pt-[65px] flex flex-col md:flex-row relative md:overflow-hidden md:h-[100vh]">
            <div className="w-full h-full">
                {!isLoading ? (
                    data ? (
                        <LearnVideo
                            key={data.id}
                            learningProgress={{
                                id: learning_progress_id as string,
                                subchapter_progress:
                                    subchapter_progress as SubchapterProgress[],
                                latest_subchapter:
                                    latest_subchapter as SubchapterProgress
                            }}
                        />
                    ) : (
                        <></>
                    )
                ) : (
                    <div className="w-full h-3/4 bg-neutral-600 animate-pulse" />
                )}
            </div>
            <div
                className="md:hidden bg-neutral-800 border-4 border-neutral-600 text-neutral-200 top-[65px] right-0 w-8 rounded-l-xl h-16 z-10 fixed flex justify-center items-center"
                onClick={() => setShowMaterial(true)}
                aria-hidden>
                <FaChevronLeft />
                <FaChevronLeft className="-ml-2" />
            </div>
            {isMobileBreakpoints && id && showMaterial && (
                <div className="fixed z-[100] top-0 right-0 w-screen h-[calc(100vh-64px)] bg-neutral-900">
                    <header className="w-full px-4 md:px-8 py-4 flex items-center justify-between">
                        <span className="text-2xl font-bold cursor-pointer font-[Urbanist]">
                            Gradient
                        </span>
                        <div
                            className="flex items-center"
                            onClick={() => setShowMaterial(false)}
                            aria-hidden>
                            <FaChevronRight />
                            <FaChevronRight className="-ml-2" />
                            <span className="text-bold">Tutup</span>
                        </div>
                    </header>
                    <LearnContentBox
                        extraCallback={() => setShowMaterial(false)}
                        slug={id as string}
                        chapters={chapters}
                        isSubscribed={is_subscribed}
                    />
                </div>
            )}
            <div className="w-full md:w-[25vw] hidden md:block">
                {id && (
                    <LearnContentBox
                        slug={id as string}
                        chapters={chapters}
                        isSubscribed={is_subscribed}
                    />
                )}
            </div>
        </section>
    );
};

export default VideoLearnContainer;
