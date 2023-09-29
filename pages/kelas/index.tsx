import LearnLayout from 'commons/learnLayout';
import ClassContainer from 'courses/containers';

const ListClass = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <ClassContainer />
        </LearnLayout>
    );
};

ListClass.displayName = 'Classes';
export default ListClass;
