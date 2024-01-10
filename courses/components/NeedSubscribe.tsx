import { MdPlayCircleOutline, MdOutlineGroup, MdEdit } from 'react-icons/md';
import Button from 'commons/components/elements/Button';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useRouter } from 'next/router';
import { AUTHENTICATION_ROUTE } from 'commons/constants';

const BenefitItems = ({
    icons,
    title
}: {
    icons: JSX.Element;
    title: string;
}): JSX.Element => {
    return (
        <div className="flex items-center my-4">
            <div className="mr-2 text-xl">{icons}</div>
            <div>
                <h3 className="text-xl">{title}</h3>
            </div>
        </div>
    );
};

const NeedSubscribe = ({}: { thumbnail?: string }): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const router = useRouter();

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
                    title="Akses semua video pembelajaran on demand"
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
                                router.push(
                                    `${AUTHENTICATION_ROUTE}?redirect=/langganan`
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
