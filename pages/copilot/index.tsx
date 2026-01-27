import LearnLayout from 'commons/learnLayout';
import { GetStaticProps } from 'next';
import CopilotContainer from 'copilot/containers/revamp/CopilotContainer';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';

const Copilot = (): JSX.Element => {
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const isAuthenticated = useSelector(getIsAuthenticated);

    return (
        <LearnLayout
            noPadding
            hideNavbar={isAuthenticated && isMobileBreakpoints}
            noTopPadding>
            <CopilotContainer />
        </LearnLayout>
    );
};

export const getStaticProps: GetStaticProps = () => {
    return {
        props: {
            canonical: 'https://gradient.academy/copilot',
            title: 'Gradient Copilot AI - Asisten Belajar Kamu',
            description:
                'Belajar dengan bantuan Asisten AI yang siap membantu kamu 24 jam non stop!'
        }
    };
};

export default Copilot;
