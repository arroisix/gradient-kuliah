import LearnLayout from 'commons/learnLayout';
import { GetStaticProps } from 'next';
import CopilotContainer from '../../copilot/containers/CopilotContainer';
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
            title: 'Gradient Copilot AI - Your Smart Study Assistant',
            description:
                'Learn with AI-powered assistance that helps you understand concepts better through interactive discussions and guided problem-solving.'
        }
    };
};

export default Copilot;
