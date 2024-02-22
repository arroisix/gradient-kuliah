import LearnLayout from 'commons/learnLayout';
import ClassContainer from 'courses/containers';
import { GridProvider } from 'courses/contexts/GridProvider';

const ListClass = (): JSX.Element => {
    return (
        <GridProvider>
            <LearnLayout showSidebar fullHeightSidebar>
                <ClassContainer />
            </LearnLayout>
        </GridProvider>
    );
};

ListClass.displayName = 'Classes';
export default ListClass;
