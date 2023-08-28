import { useThemeContext } from 'commons/contexts/ThemeProvider';
import LearnLayout from 'commons/learnLayout';
import AstronoteDetail from 'courses/containers/learn/astronotes/detail';

const AstroNotes = (): JSX.Element => {
    const { theme } = useThemeContext();

    return (
        <LearnLayout lightMode={theme === 'light'}>
            <AstronoteDetail />
        </LearnLayout>
    );
};

export default AstroNotes;
