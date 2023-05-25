import { MdPlayCircleOutline, MdOutlineGroup, MdEdit } from 'react-icons/md';
import Button from 'commons/components/elements/Button';
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

const NeedSubscribe = ({}: { thumbnail?: string }): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { setModalAuthOpen } = useAuth();

    return (
        <div className="relative">
            <div className="w-full h-full p-16 bg-neutral-400">
                <h1 className="text-2xl font-bold">
                    Tertarik ngelanjutin materinya? <br /> Yuk gabung kelasnya
                    sekarang
                </h1>
                <span className="text-neutral-700">
                    Selain bisa akses materi ini, kamu juga bisa dapat:
                </span>
                <BenefitItems
                    icons={<MdPlayCircleOutline />}
                    title="120+ Video Pembelajaran On Demand"
                />
                <BenefitItems
                    icons={<MdEdit />}
                    title="AstroNotes, Catatan materi lengkap dari Gradient"
                />
                <BenefitItems
                    icons={<MdOutlineGroup />}
                    title="Komunitas Gradient"
                />
                <div className="flex">
                    {isAuthenticated ? (
                        <Button variant="primary" href={`/langganan`}>
                            Gabung Kelas
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            onClick={() =>
                                setModalAuthOpen(1, false, `/langganan`)
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
