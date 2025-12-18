import {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useMemo,
    useState
} from 'react';
import { MdClose } from 'react-icons/md';
import { SetTargetForm } from './SetTargetForm';
import { useGetStudentTargetInstitutionsQuery } from 'dashboard/redux/api/dashboardApi';
import dynamic from 'next/dynamic';

const SetTargetInstitutionWall = dynamic(
    () => import('./SetTargetInstitutionWall')
);

interface SetTargetDrawerContextType {
    setIsDrawerOpened: Dispatch<SetStateAction<boolean>>;
}

const SetTargetDrawerContext = createContext<SetTargetDrawerContextType | null>(
    null
);

function SetTargetDrawer({ children }: PropsWithChildren) {
    const [isDrawerOpened, setIsDrawerOpened] = useState(false);
    const [isTargetWallHidden, setIsTargetWallHidden] = useState(false);

    const { data, isLoading, isFetching } =
        useGetStudentTargetInstitutionsQuery();

    const value = useMemo((): SetTargetDrawerContextType => {
        return { setIsDrawerOpened };
    }, []);

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
                    {data?.length === 0 && !isTargetWallHidden ? (
                        <SetTargetInstitutionWall
                            setIsTargetWallHidden={setIsTargetWallHidden}
                        />
                    ) : (
                        children
                    )}
                </div>

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
                                Pilih kampus dan jurusan yang kamu incar. Soal
                                akan menyesuaikan tingkat kesulitannya.
                            </p>
                        </div>

                        <SetTargetForm />
                    </div>
                </div>
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
