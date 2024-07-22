import { useEffect, useState } from 'react';
import Description from './Description';
import CourseDetailBox from '../CourseDetailBox';
import QnaSection from '../LearningExperience/QnaSection';
import { useTracker } from 'tracker/tracker';
import { useRouter } from 'next/router';
import { useLearning } from 'courses/contexts/LearningProvider';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';

const CourseSummary = ({
    ssrSubchapter
}: {
    ssrSubchapter: SubChapter;
}): JSX.Element => {
    const tracker = useTracker();
    const router = useRouter();
    const { subchapter } = useLearning();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { isDesktopBreakpoints } = useWindowBreakpoints();

    const [navigation, setNavigation] = useState<
        'DESCRIPTION' | 'DISCUSSION' | 'COURSE'
    >('DESCRIPTION');

    useEffect(() => {
        if (!isDesktopBreakpoints) setNavigation('COURSE');
        else setNavigation('DESCRIPTION');
    }, [isDesktopBreakpoints]);

    return (
        <div className="flex flex-col gap-5 pt-8 pb-12 bg-[#121212]">
            <div className="flex gap-5 px-5 lg:gap-8 md:px-16">
                <button
                    className={`uppercase lg:hidden font-bold text-sm pb-[6px] cursor-pointer ${
                        navigation === 'COURSE'
                            ? 'border-b-2 border-accent-purple'
                            : 'text-neutral-600 border-none hover:text-neutral-500'
                    }`}
                    onClick={() => {
                        tracker?.genericTrack('Click Material Tab', {
                            'Course Slug': router.query.id,
                            'Video Title': subchapter?.subchapter_name
                        });
                        setNavigation('COURSE');
                    }}>
                    <h2>Pelajaran</h2>
                </button>
                <button
                    className={`uppercase font-bold text-sm pb-3 cursor-pointer ${
                        navigation === 'DESCRIPTION'
                            ? 'border-b-2 border-accent-purple'
                            : 'text-neutral-600 border-none hover:text-neutral-500'
                    }`}
                    onClick={() => {
                        tracker?.genericTrack('Click Description Tab', {
                            'Course Slug': router.query.id,
                            'Video Title': subchapter?.subchapter_name
                        });
                        setNavigation('DESCRIPTION');
                    }}>
                    <h2>Deskripsi</h2>
                </button>
                {isAuthenticated && (
                    <span
                        className={`inline-block font-bold text-sm pb-[6px] cursor-pointer ${
                            navigation === 'DISCUSSION'
                                ? 'border-b-2 border-accent-purple'
                                : 'text-neutral-600 border-none hover:text-neutral-500'
                        }`}
                        onClick={() => {
                            tracker?.genericTrack('Click QnA Tab', {
                                'Course Slug': router.query.id,
                                'Video Title': subchapter?.subchapter_name
                            });
                            setNavigation('DISCUSSION');
                        }}
                        aria-hidden>
                        DISKUSI
                    </span>
                )}
            </div>
            <div>
                {navigation === 'COURSE' && <CourseDetailBox />}
                {navigation === 'DESCRIPTION' && (
                    <Description ssrSubchapter={ssrSubchapter} />
                )}
                {isAuthenticated && navigation === 'DISCUSSION' && (
                    <div className="md:px-16">
                        <QnaSection />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseSummary;
