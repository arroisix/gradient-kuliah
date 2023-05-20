import { useRouter } from 'next/router';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';

import Lock from 'commons/components/elements/Icons/Lock';
import { ContentAccordionItemProps } from './ContentSection';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import Play from 'commons/components/elements/Icons/Play';
import GreenCheck from 'commons/components/elements/Icons/GreenCheck';

const VideoAccordionItem = ({
    subchapter,
    chapterId,
    isSubscribed,
    contentPicked,
    slug,
    extraCallback
}: ContentAccordionItemProps): JSX.Element => {
    const router = useRouter();
    const { setModalAuthOpen } = useAuth();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { watch_progress } = useCourseSubscription(slug);

    const decideOnClickAction = (): void => {
        if (isAuthenticated) {
            if (extraCallback) {
                extraCallback();
            }
            router.replace(
                `/kelas/${slug}/belajar/video/${chapterId}/${subchapter.id}`,
                undefined,
                { shallow: true }
            );
        } else {
            setModalAuthOpen(
                1,
                false,
                `/kelas/${slug}/belajar/video/${chapterId}/${subchapter.id}`
            );
        }
    };

    return (
        <div
            aria-hidden={true}
            onClick={decideOnClickAction}
            key={subchapter.id}
            className={`w-full flex items-center gap-2 px-7 py-2 hover:bg-[#272727] cursor-pointer ${
                contentPicked?.id === subchapter?.video?.id && 'bg-[#272727]'
            }`}>
            <div>
                {subchapter?.video?.is_free || isSubscribed ? (
                    watch_progress?.filter(
                        (progress: SubchapterProgress) =>
                            progress?.subchapter?.id === subchapter?.id &&
                            progress?.video?.is_finished
                    )?.length ?? 0 > 0 ? (
                        <GreenCheck />
                    ) : (
                        <Play />
                    )
                ) : (
                    <Lock />
                )}
            </div>
            <div>
                <span className="font-body">{subchapter?.subchapter_name}</span>
                <div>
                    <span
                        className={
                            contentPicked?.id === subchapter?.video?.id
                                ? 'text-neutral-400'
                                : 'text-neutral-600'
                        }>
                        {subchapter?.video?.duration}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default VideoAccordionItem;
