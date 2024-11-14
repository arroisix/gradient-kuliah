import { NextPage } from 'next';
import ExerciseStartContent from 'courses/components/Latihan/ExerciseStart/ExerciseStartContent';
import withAuth from 'commons/withAuth';

const ExerciseStartPage: NextPage = () => {
    return <ExerciseStartContent />;
};

export default withAuth(ExerciseStartPage);
