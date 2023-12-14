import Button from 'commons/components/elements/Button';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import Image from 'next/image';
import { useRouter } from 'next/router';

export const NoLearningProgress = (): JSX.Element => {
    const router = useRouter();
    const { is_subscribed } = useCourseSubscription();

    return (
        <div className="flex flex-col gap-[64px] relative w-full md:max-w-[633px] bg-[#1D1D1D] p-10 rounded-xl overflow-hidden">
            <div>
                <h6 className="font-extrabold text-[24px] pb-[10px]">
                    Belum ada progress belajar
                </h6>
                <span className="inline-block font-body sm:max-w-[70%] md:max-w-full lg:max-w-[70%]">
                    {is_subscribed
                        ? 'Anda sudah memiliki kelas. Mulai belajar sekarang'
                        : 'Anda belum memiliki kelas apapun. Mulai dengan  memilih kelas yang tepat umtuk anda'}
                </span>
            </div>
            <div>
                <Button
                    variant="custom"
                    className="font-sans text-xs font-bold text-black bg-white"
                    onClick={() =>
                        router.push(
                            `${is_subscribed ? '/kelas' : '/langganan'}`
                        )
                    }
                    eventName="Start Learning Button">
                    {is_subscribed ? 'Mulai Belajar' : 'Beli Kelas'}
                </Button>
            </div>
            <div className="absolute w-[252px] h-[230px] bottom-0 right-0">
                <Image
                    src={
                        is_subscribed
                            ? 'https://assets.gradient.academy/assets/globe.png'
                            : 'https://assets.gradient.academy/assets/book-shelf.png'
                    }
                    alt={'subchapter_name'}
                    layout="fill"
                    className="object-contain"
                />
            </div>
        </div>
    );
};
