import DescriptionSection from './DescriptionSection';
import QnaSection from './QnaSection';

const SECTION_MAP: { [key: number]: JSX.Element } = {
    0: <DescriptionSection />,
    2: <QnaSection />
};

const ContentSection = ({ tab }: { tab: number }): JSX.Element => {
    return (
        <div className="w-full min-h-64 overflow-x-hidden">
            {SECTION_MAP[tab]}
        </div>
    );
};

export default ContentSection;
