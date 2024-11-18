import { useState } from 'react';
import HistorySection from '../components/HistorySection/HistorySection';
import MainSection from '../components/MainSection/MainSection';

const CopilotContainer = (): JSX.Element => {
    const [showHistory, setShowHistory] = useState(true);

    return (
        <div className="flex h-screen">
            <HistorySection
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                onOpen={() => setShowHistory(true)}
            />
            <MainSection />
        </div>
    );
};

export default CopilotContainer;
