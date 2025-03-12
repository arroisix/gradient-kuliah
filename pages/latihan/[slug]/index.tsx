import { NextPage } from 'next';
import ExerciseStartContent from 'latihan/containers/ExerciseStartContent';
import withAuth from 'commons/withAuth';

const ExerciseStartPage: NextPage = () => {
    return <ExerciseStartContent />;
};

export default withAuth(ExerciseStartPage);
