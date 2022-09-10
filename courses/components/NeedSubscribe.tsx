import { MdPlayCircleOutline, MdOutlineGroup } from 'react-icons/md';
import Button from 'commons/components/elements/Button';
import { useRouter } from 'next/router';
import useCourseDetail from 'courses/hooks/useCourseDetail';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useAuth } from 'authentication/contexts/AuthProvider';

const BenefitItems = ({
    icons,
    title
}: {
    icons: JSX.Element;
    title: string;
}): JSX.Element => {
    return (
        <div className="flex items-center my-4">
            <div className="text-xl mr-2">{icons}</div>
            <div>
                <h1 className="text-xl">{title}</h1>
            </div>
        </div>
    );
};

const NeedSubscribe = ({ thumbnail }: { thumbnail?: string }): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const { data } = useCourseDetail(id as string);
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { setModalAuthOpen } = useAuth();

    return (
        <div className="relative overflow-y-scroll">
            <div className="w-full h-full bg-black absolute top-0 flex justify-center items-center opacity-40" />
            <div
                className="w-full h-[435px] bg-red-100 "
                style={{
                    background: `url(${thumbnail})`,
                    backgroundSize: 'cover'
                }}></div>
            <div className="w-full h-full absolute top-0 p-16">
                <h1 className="text-2xl font-bold">
                    Gabung kelas untuk mengakses materi ini, yuk!{' '}
                </h1>
                <span className="text-neutral-400">
                    Selain bisa akses materi ini, kamu juga bisa dapat:
                </span>
                {/* <BenefitItems
                    icons={<BsPatchCheck />}
                    title="Sertifikat setelah menyelesaikan kelas"
                /> */}
                <BenefitItems
                    icons={<MdPlayCircleOutline />}
                    title="Semua video materi"
                />
                {/* <BenefitItems
                    icons={<MdOutlineArticle />}
                    title="Semua artikel dan latihan soal"
                /> */}
                <BenefitItems
                    icons={<MdOutlineGroup />}
                    title="Komunitas buat belajar dan nugas bareng"
                />
                <div className="flex">
                    {isAuthenticated ? (
                        <Button
                            variant="primary"
                            href={`/langganan?courseId=${data?.id}`}>
                            Gabung Kelas
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            onClick={() => setModalAuthOpen(1)}>
                            Gabung Kelas
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NeedSubscribe;
