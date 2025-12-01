import { NextPage } from 'next';
import ExerciseDetail from 'exercises/containers/ExerciseDetail';
import withAuth from 'commons/withAuth';

const ExerciseStartPage: NextPage = () => {
    return <ExerciseDetail />;
};

export default withAuth(ExerciseStartPage);
