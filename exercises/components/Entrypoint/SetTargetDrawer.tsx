import {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import { MdClose } from 'react-icons/md';
import { SetTargetForm } from './SetTargetForm';
import { useGetStudentTargetInstitutionsQuery } from 'dashboard/redux/api/dashboardApi';
import dynamic from 'next/dynamic';
import { StudentTargetInstitution } from 'dashboard/types/dashboard';
import { useWindowSize } from 'usehooks-ts';
import Modal from 'commons/components/modules/Modal';

const SetTargetInstitutionWall = dynamic(
    () => import('./SetTargetInstitutionWall')
);

interface SetTargetDrawerContextType {
    setIsDrawerOpened: Dispatch<SetStateAction<boolean>>;
    setIsModalOpened: Dispatch<SetStateAction<boolean>>;
}

const SetTargetDrawerContext = createContext<SetTargetDrawerContextType | null>(
    null
);

function SetTargetDrawer({ children }: PropsWithChildren) {
    const [targets, setTargets] = useState<StudentTargetInstitution[]>([]);
    const [isDrawerOpened, setIsDrawerOpened] = useState(false);
    const [isModalOpened, setIsModalOpened] = useState(false);
    const { width } = useWindowSize();

    const { data, isLoading, isFetching } =
        useGetStudentTargetInstitutionsQuery();

    const value = useMemo((): SetTargetDrawerContextType => {
        return { setIsDrawerOpened, setIsModalOpened };
    }, []);

    useEffect(() => {
        if (data && data.length > 0) {
            setTargets(data);
        }
    }, [data]);

    useEffect(() => {
        if (width < 768 && isDrawerOpened) {
            setIsModalOpened(true);
            setIsDrawerOpened(false);
        }

        if (width >= 768 && isModalOpened) {
            setIsDrawerOpened(true);
            setIsModalOpened(false);
        }
    }, [isDrawerOpened, isModalOpened, width]);

    if (isLoading || isFetching) {
        return <></>;
    }

    return (
        <SetTargetDrawerContext.Provider value={value}>
            <div className="drawer drawer-end">
                <input
                    checked={isDrawerOpened}
                    type="checkbox"
                    className="drawer-toggle"
                />

                <div className="drawer-content">
                    {targets.length === 0 ? (
                        <SetTargetInstitutionWall />
                    ) : (
                        children
                    )}
                </div>

                {width < 768 ? (
                    <Modal
                        isOpen={isModalOpened}
                        setOpen={(value) => setIsModalOpened(value)}
                        variant="dark"
                        permanent={true}
                        className="bg-[#101010] h-screen">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-semibold">
                                    Tentukan Target
                                </h2>
                                <button
                                    onClick={() => setIsModalOpened(false)}
                                    aria-label="close modal">
                                    <MdClose className="fill-[#4D5165] w-6 h-6" />
                                </button>
                            </div>

                            <p className="text-sm">
                                Pilih kampus dan jurusan yang kamu incar. Soal
                                akan menyesuaikan tingkat kesulitannya.
                            </p>

                            <SetTargetForm
                                targets={targets}
                                setTargets={setTargets}
                                setIsOpen={setIsModalOpened}
                            />
                        </div>
                    </Modal>
                ) : (
                    <div className="drawer-side z-[9999]">
                        <button
                            onClick={() => setIsDrawerOpened(false)}
                            aria-label="close sidebar"
                            className="drawer-overlay"></button>

                        <div className="bg-[#101010] min-h-full w-full max-w-[520px] px-6">
                            <button
                                onClick={() => setIsDrawerOpened(false)}
                                aria-label="close sidebar"
                                className="block pt-4">
                                <MdClose className="w-6 h-6" />
                            </button>

                            <div className="space-y-3 mt-4">
                                <h2 className="text-white font-bold text-xl text-center">
                                    Tentukan Target
                                </h2>
                                <p className="text-[#999999] text-center">
                                    Pilih kampus dan jurusan yang kamu incar.
                                    Soal akan menyesuaikan tingkat kesulitannya.
                                </p>
                            </div>

                            {/* re-mount as "isDrawerOpened" state changed */}
                            {isDrawerOpened ? (
                                <SetTargetForm
                                    targets={targets}
                                    setTargets={setTargets}
                                    setIsOpen={setIsDrawerOpened}
                                />
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </SetTargetDrawerContext.Provider>
    );
}

function useSetTargetDrawerContext() {
    const context = useContext(SetTargetDrawerContext);
    if (context === null) {
        throw new Error(
            'useSetTargetDrawerContext must be used within a SetTargetDrawerContext.Provider'
        );
    }
    return context;
}

export default SetTargetDrawer;
export { useSetTargetDrawerContext };
