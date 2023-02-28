import { useRouter } from 'next/router';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';

import Lock from 'commons/components/elements/Icons/Lock';
import { ContentAccordionItemProps } from './ContentSection';
import { BiPlayCircle } from 'react-icons/bi';

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
            className={`w-full flex items-center gap-2 px-7 py-2 hover:bg-neutral-600 cursor-pointer ${
                contentPicked?.id === subchapter?.video?.id && 'bg-neutral-600'
            }`}>
            <div>
                {subchapter?.video?.is_free || isSubscribed ? (
                    <BiPlayCircle className="text-xl" />
                ) : (
                    <Lock />
                )}
            </div>
            <span className="font-body w-3/4 truncate">
                {subchapter?.subchapter_name}
            </span>
            <div className="w-1/4 flex justify-end">
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
    );
};

export default VideoAccordionItem;
