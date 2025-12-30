import Button from 'commons/components/elements/Button';
import { ChevronLeft, CopyIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { useTracker } from 'tracker/tracker';
import { toast } from 'react-toastify';
import { useGetExerciseDetailV2Query } from 'exercises/redux/api/exercisesApi';

const ExerciseDetailHeader = () => {
    const router = useRouter();
    const tracker = useTracker();
    const { slug } = router.query;

    const { data: exercise } = useGetExerciseDetailV2Query(
        { exercise_slug: slug as string },
        {
            skip: !slug
        }
    );

    function handleCopy(): void {
        if (typeof window !== 'undefined' && !!exercise) {
            const finalShareCopy = `${`Yuk coba kerjain ${exercise.title} di Gradient Academy!`}\nLink: ${
                window.location.href
            } \n`;

            navigator.clipboard.writeText(finalShareCopy);
            toast.success('Link berhasil disalin', {
                theme: 'colored'
            });

            tracker?.trackButtonClick(
                `Click Share Button Exercise`,
                'Bagikan',
                {
                    type: 'Exercise',
                    share: finalShareCopy,
                    link: window.location.href
                }
            );
        }
    }

    return (
        <header className="w-full flex items-center justify-between pb-6">
            <Button
                onClick={() => router.back()}
                variant="secondary"
                className="rounded-full text-center !p-0 !w-8 !h-8 flex items-center justify-center">
                <ChevronLeft size={14} />
            </Button>
            <Button
                className="flex gap-2 items-center"
                size="extraSmall"
                variant="secondary"
                onClick={handleCopy}>
                <span className="hidden lg:flex">Salin Quiz Link</span>
                <CopyIcon size={14} />
            </Button>
        </header>
    );
};

export default ExerciseDetailHeader;
