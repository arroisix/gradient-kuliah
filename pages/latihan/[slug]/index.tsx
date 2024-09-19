import { useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Skeleton from 'commons/components/elements/Skeleton';
import { useGetExerciseDetailQuery } from '../../../courses/redux/api/exercisesApi';
import LatihanLayout from '../../../courses/components/Latihan/LatihanLayout';

const LatihanStart = dynamic(
    () => import('../../../courses/components/Latihan/LatihanStart'),
    { ssr: false }
);

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
        if (!isLoading && !exercise && typeof window !== 'undefined') {
            router.back();
        }
    }, [isLoading, exercise, router]);

    if (typeof window === 'undefined') {
        return null;
    }

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

export async function getServerSideProps() {
    return {
        props: {}
    };
}

export default ExerciseStartPage;
