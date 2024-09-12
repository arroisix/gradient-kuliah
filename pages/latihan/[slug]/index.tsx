import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Skeleton from 'commons/components/elements/Skeleton';
import { useGetExerciseDetailQuery } from '../../../courses/redux/api/exercisesApi';
import LatihanLayout from '../../../courses/components/Latihan/LatihanLayout';
import LatihanStart from '../../../courses/components/Latihan/LatihanStart';

const ExerciseStartPage = () => {
    const router = useRouter();
    const [slug, setSlug] = useState<string | null>(null);

    useEffect(() => {
        if (router.isReady) {
            setSlug(router.query.slug as string);
        }
    }, [router.isReady, router.query.slug]);

    const { data: exercise, isLoading } = useGetExerciseDetailQuery(
        { exercise_slug: slug as string },
        {
            skip: !slug
        }
    );

    if (!router.isReady || isLoading) {
        return (
            <LatihanLayout>
                <Skeleton className="w-full h-full" />
            </LatihanLayout>
        );
    }

    if (!exercise) {
        if (typeof window !== 'undefined') {
            router.push('/latihan');
        }
        return null;
    }

    return (
        <LatihanLayout>
            <LatihanStart exercise={exercise} />
        </LatihanLayout>
    );
};

export default ExerciseStartPage;
