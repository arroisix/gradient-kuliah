import Button from 'commons/components/elements/Button';
import { ChevronLeft, CopyIcon } from 'lucide-react';
import { useRouter } from 'next/router';

const ExerciseDetailHeader = () => {
    const router = useRouter();

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
                variant="secondary">
                <span className="hidden lg:flex">Salin Quiz Link</span>
                <CopyIcon size={14} />
            </Button>
        </header>
    );
};

export default ExerciseDetailHeader;
