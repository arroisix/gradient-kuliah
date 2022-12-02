// import Layout from 'commons/layout';
// import NotebookLearnContainer from 'courses/containers/learn/notebook';
import { useRouter } from 'next/router';
// import { LearningProvider } from 'courses/contexts/LearningProvider';
// import { useGetPublicCourseQuery } from 'courses/redux/api/publicCourseApi';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useSelector } from 'react-redux';
// import { useGetPrivateCourseQuery } from 'courses/redux/api/privateCourseApi';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { useEffect } from 'react';

const Belajar = (): JSX.Element => {
    const router = useRouter();
    const { setModalAuthOpen } = useAuth();
    const { id } = router.query;
    const isAuthenticated = useSelector(getIsAuthenticated);
    // const { data: publicCourse } = useGetPublicCourseQuery(id as string, {
    //     skip: isAuthenticated || typeof id === 'undefined'
    // });
    // const { data: privateCourse } = useGetPrivateCourseQuery(id as string, {
    //     skip: !isAuthenticated || typeof id === 'undefined'
    // });

    useEffect(() => {
        if (id && !isAuthenticated) {
            setModalAuthOpen(1, true);
        }
    }, [isAuthenticated, id]);

    // const getCourse = (): Course => {
    //     if (isAuthenticated) {
    //         return privateCourse ?? ({} as Course);
    //     }
    //     return publicCourse ?? ({} as Course);
    // };

    return (
        // <LearningProvider course={getCourse()} type="notebook">
        //     <Layout>
        //         <NotebookLearnContainer course={getCourse()} />
        //     </Layout>
        // </LearningProvider>
        <div></div>
    );
};

export default Belajar;
