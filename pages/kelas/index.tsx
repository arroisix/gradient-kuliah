import LearnLayout from 'commons/learnLayout';
import ClassContainer from 'courses/containers';

const ListClass = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <ClassContainer />
        </LearnLayout>
    );
};

export default ListClass;
