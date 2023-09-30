import { useThemeContext } from 'commons/contexts/ThemeProvider';
import LearnLayout from 'commons/learnLayout';
import Astronotes from 'courses/containers/learn/astronotes';

const AstroNotesPage = (): JSX.Element => {
    const { theme } = useThemeContext();

    return (
        <LearnLayout lightMode={theme === 'light'}>
            <Astronotes />
        </LearnLayout>
    );
};

AstroNotesPage.displayName = 'Books Reader';
export default AstroNotesPage;
