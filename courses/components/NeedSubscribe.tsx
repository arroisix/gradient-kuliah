import { MdPlayCircleOutline, MdOutlineGroup, MdEdit } from 'react-icons/md';
import Button from 'commons/components/elements/Button';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { useGetLandingCourseDataQuery } from 'courses/redux/api/publicCourseApi';

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
    const { data } = useGetLandingCourseDataQuery(id as string, {
        skip: id === undefined || id === null
    });
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
                    Tertarik ngelanjutin materinya? <br /> Yuk gabung kelasnya
                    sekarang
                </h1>
                <span className="text-neutral-400">
                    Selain bisa akses materi ini, kamu juga bisa dapat:
                </span>
                <BenefitItems
                    icons={<MdPlayCircleOutline />}
                    title="70+ Video Pembelajaran On Demand"
                />
                <BenefitItems icons={<MdEdit />} title="1x Live Tutor/Minggu" />
                <BenefitItems
                    icons={<MdOutlineGroup />}
                    title="Komunitas Gradient"
                />
                <div className="flex">
                    {isAuthenticated ? (
                        <Button
                            variant="primary"
                            href={`/langganan?courseId=${data?.course_id}`}>
                            Gabung Kelas
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            onClick={() =>
                                setModalAuthOpen(
                                    1,
                                    false,
                                    `/langganan?courseId=${data?.course_id}`
                                )
                            }>
                            Gabung Kelas
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NeedSubscribe;
