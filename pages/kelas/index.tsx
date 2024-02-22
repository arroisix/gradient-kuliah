import axios from 'axios';
import LearnLayout from 'commons/learnLayout';
import ClassContainer from 'courses/containers';
import { GridProvider } from 'courses/contexts/GridProvider';
import { useEffect, useState } from 'react';
import config from 'redux/api/config';

const ListClass = (): JSX.Element => {
    return (
        <GridProvider>
            <LearnLayout 
                showSidebar 
                fullHeightSidebar 
            >
                <ClassContainer />
            </LearnLayout>
        </GridProvider>
    );
};

ListClass.displayName = 'Classes';
export default ListClass;
