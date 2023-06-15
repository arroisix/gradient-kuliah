import Image from 'next/image';
import { useRouter } from 'next/router';
import { HiOutlinePlusSm } from 'react-icons/hi';
import ProgressBar from './ProgressBar';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';

const dummyData = {
    learning_progress: [
        {
            course_slug: 'kalkulus2',
            chapter_id: 'sdasda',
            subchapter_id: 'asdasd',
            subchapter_thumbnail: 'asdasdasda',
            subchapter_name:
                'Estimasi Nilai Pi dengan menggunakan Metode Monte Carlo',
            course_name: 'Probabilitas dan Statistika',
            progress_percentage: '80%'
        },
        {
            course_slug: 'kalkulus1',
            chapter_id: 'sdasda',
            subchapter_id: 'asdasd',
            subchapter_thumbnail: 'asdasdasda',
            subchapter_name: 'Ganti Gambar! Kalo udh nyambung BE',
            course_name: 'Kalkulus 1',
            progress_percentage: '20%'
        }
    ]
};
// const dummyData = {
//     learning_progress: []
// };

const ContinueLearning = ({
    className
}: {
    className?: string;
}): JSX.Element => {
    return (
        <div className={`flex flex-col gap-3 md:gap-5 ${className}`}>
            <h3 className="text-lg font-extrabold">Lanjut Belajar</h3>
            {dummyData.learning_progress.length === 0 ? (
                <NoLearningProgress />
            ) : (
                <ListContinueLearning />
            )}
        </div>
    );
};

const ListContinueLearning = (): JSX.Element => {
    const router = useRouter();

    return (
        <div className="relative flex flex-col gap-4">
            {dummyData?.learning_progress.map(
                ({
                    course_slug,
                    chapter_id,
                    subchapter_id,
                    subchapter_thumbnail,
                    subchapter_name,
                    course_name,
                    progress_percentage
                }) => (
                    <div
                        key={course_slug}
                        className="flex flex-col md:flex-row gap-[8px] md:gap-[30px] items-start justify-start md:items-center md:justify-center cursor-pointer"
                        onClick={() =>
                            router.push(
                                `/kelas/${course_slug}/${chapter_id}/${subchapter_id}`
                            )
                        }
                        aria-hidden>
                        <div className="relative w-[260px] md:w-[160px] lg:w-[260px] min-h-[150px] rounded-lg overflow-hidden">
                            <Image
                                src={
                                    'https://storage.googleapis.com/gradient-asset-dev/courses/calculus2/assets/kalkulus2-thumbnail.png'
                                }
                                alt={subchapter_thumbnail}
                                layout="fill"
                                className="object-contain"
                            />
                        </div>
                        <div className="flex flex-col gap-[5px] w-full">
                            <span className="inline-block font-body">
                                {subchapter_name}
                            </span>
                            <span className="inline-block font-body text-xs text-neutral-200">
                                {course_name}
                            </span>
                            <ProgressBar percent={progress_percentage} />
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

const NoLearningProgress = (): JSX.Element => {
    const router = useRouter();
    const { is_subscribed } = useCourseSubscription();

    return (
        <div
            className="flex flex-col md:flex-row gap-[8px] md:gap-[30px] items-start justify-start md:items-center md:justify-center cursor-pointer"
            onClick={() =>
                router.push(`${is_subscribed ? '/kelas' : '/langganan'}`)
            }
            aria-hidden>
            <div className="relative flex items-center justify-center w-[260px] md:w-[160px] lg:w-[260px] min-h-[150px] rounded-lg bg-[#242424]">
                <HiOutlinePlusSm size={24} className="text-[#373737]" />
            </div>
            <div className="flex flex-col gap-[5px] w-full">
                <span className="inline-block font-body">
                    Belum ada Progress Belajar
                </span>
                <ProgressBar percent={'0%'} />
            </div>
        </div>
    );
};

export default ContinueLearning;
