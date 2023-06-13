import Layout from 'commons/layout';
import ClassContainer from 'courses/containers';

const ListClass = (): JSX.Element => {
    return (
        <Layout showSidebar fullHeightSidebar>
            <ClassContainer />
        </Layout>
    );
};

export default ListClass;
