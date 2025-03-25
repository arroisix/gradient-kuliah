import { NextPage } from 'next';
import ExerciseStartContent from 'exercises/containers/ExerciseStartContent';
import withAuth from 'commons/withAuth';

const ExerciseStartPage: NextPage = () => {
    return <ExerciseStartContent />;
};

export default withAuth(ExerciseStartPage);
