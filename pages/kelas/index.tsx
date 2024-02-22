import LearnLayout from 'commons/learnLayout';
import ClassContainer from 'courses/containers';
import { GridProvider } from 'courses/contexts/GridProvider';

const ListClass = (): JSX.Element => {
    return (
        <GridProvider>
            <LearnLayout showSidebar fullHeightSidebar>
                <ClassContainer />
                {/* <div className="h-[200vh]">
                    <div className="bg-blue-500 h-[500px]"></div>
                    <div className="bg-red-500 h-[100px] w-[100px] sticky top-0"></div>
                </div> */}
            </LearnLayout>
        </GridProvider>
    );
};

ListClass.displayName = 'Classes';
export default ListClass;
