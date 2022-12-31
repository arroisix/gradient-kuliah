import { useLearning } from 'courses/contexts/LearningProvider';
import { useState } from 'react';
import ContentSection from './ContentSection';
import MenuSection from './MenuSection';

const LearningExperience = (): JSX.Element => {
    const [tab, setTab] = useState(0);
    const { subchapter } = useLearning();

    return (
        <>
            <div className="py-4 px-4 md:px-16">
                <h3 className="text-2xl md:text-4xl font-bold">
                    {subchapter?.subchapter_name}
                </h3>
            </div>
            <div className="my-8 md:px-16 pb-4 md:pb-[7.5rem]">
                <MenuSection tab={tab} setTab={setTab} />
                <ContentSection tab={tab} />
            </div>
        </>
    );
};

export default LearningExperience;
