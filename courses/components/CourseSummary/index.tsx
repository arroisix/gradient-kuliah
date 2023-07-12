import { useState } from 'react';
import Description from './Description';
import CourseDetailBox from '../CourseDetailBox';
import QnaSection from '../LearningExperience/QnaSection';

const CourseSummary = (): JSX.Element => {
    const [navigation, setNavigation] = useState<
        'DESCRIPTION' | 'DISCUSSION' | 'COURSE'
    >('DESCRIPTION');

    return (
        <div className="flex flex-col gap-5 pt-8 pb-12 bg-[#121212]">
            <div className="flex gap-5 lg:gap-8 px-5 md:px-16">
                <span
                    className={`inline-block lg:hidden font-bold text-sm pb-[6px] cursor-pointer ${
                        navigation === 'COURSE'
                            ? 'border-b-2 border-accent-purple'
                            : 'text-neutral-600 border-none hover:text-neutral-500'
                    }`}
                    onClick={() => setNavigation('COURSE')}
                    aria-hidden>
                    PELAJARAN
                </span>
                <span
                    className={`inline-block font-bold text-sm pb-[6px] cursor-pointer ${
                        navigation === 'DESCRIPTION'
                            ? 'border-b-2 border-accent-purple'
                            : 'text-neutral-600 border-none hover:text-neutral-500'
                    }`}
                    onClick={() => setNavigation('DESCRIPTION')}
                    aria-hidden>
                    DESKRIPSI
                </span>
                <span
                    className={`inline-block font-bold text-sm pb-[6px] cursor-pointer ${
                        navigation === 'DISCUSSION'
                            ? 'border-b-2 border-accent-purple'
                            : 'text-neutral-600 border-none hover:text-neutral-500'
                    }`}
                    onClick={() => setNavigation('DISCUSSION')}
                    aria-hidden>
                    DISKUSI
                </span>
            </div>
            <div>
                {navigation === 'COURSE' && <CourseDetailBox />}
                {navigation === 'DESCRIPTION' && <Description />}
                {navigation === 'DISCUSSION' && (
                    <div className="md:px-16">
                        <QnaSection />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseSummary;
