import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Skeleton from 'commons/components/elements/Skeleton';
import { useGetExerciseDetailQuery } from '../../../courses/redux/api/exercisesApi';
import LatihanLayout from '../../../courses/components/Latihan/LatihanLayout';
import LatihanStart from '../../../courses/components/Latihan/LatihanStart';

const ExerciseStartPage = () => {
    const router = useRouter();
    const { slug } = router.query;

    const { data: exercise, isLoading } = useGetExerciseDetailQuery(
        { exercise_slug: slug as string },
        {
            skip: !slug
        }
    );

    useEffect(() => {
        if (!isLoading && !exercise) {
            router.back();
        }
    }, [isLoading, exercise, router]);

    if (isLoading) {
        return (
            <LatihanLayout>
                <Skeleton className="w-full h-full" />
            </LatihanLayout>
        );
    }

    if (!exercise) {
        return null;
    }

    return (
        <LatihanLayout>
            <LatihanStart exercise={exercise} />
        </LatihanLayout>
    );
};

export default ExerciseStartPage;
