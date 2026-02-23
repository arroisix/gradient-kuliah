import Modal from 'commons/components/modules/Modal';
import { cn } from 'commons/utils';
import {
    useGetStudentTargetInstitutionsQuery,
    useSetStudentTargetInstitutionsMutation
} from 'dashboard/redux/api/dashboardApi';
import {
    SetStudentTargetInstitution,
    StudentTargetInstitution
} from 'dashboard/types/dashboard';
import { useSetTargetDrawerContext } from 'exercises/components/Entrypoint/SetTargetDrawer';
import { XIcon } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FaCircleCheck, FaRegCircle } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { useWindowSize } from 'usehooks-ts';

interface UpdatePrimaryTargetModalProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function UpdatePrimaryTargetModal({
    isOpen,
    setIsOpen
}: UpdatePrimaryTargetModalProps): JSX.Element {
    const [targetInstitutions, setTargetInstitutions] = useState<
        Array<StudentTargetInstitution & { isPrimary: boolean }>
    >([]);

    const { width } = useWindowSize();
    const { setIsDrawerOpened, setIsModalOpened } = useSetTargetDrawerContext();

    const { data, isLoading: isLoadingTarget } =
        useGetStudentTargetInstitutionsQuery();

    const [updateTarget, { isLoading: isLoadingUpdateTarget }] =
        useSetStudentTargetInstitutionsMutation();

    const handleClickButton = () => {
        width < 1024 ? setIsModalOpened(true) : setIsDrawerOpened(true);
    };

    const selectTarget = (newPrimaryIdx: number) => {
        setTargetInstitutions((items) =>
            items.map((v, index) => ({
                ...v,
                isPrimary: newPrimaryIdx === index
            }))
        );
    };

    const handleUpdateTarget = async () => {
        const reconciledTarget: SetStudentTargetInstitution[] = [];
        for (const v of targetInstitutions) {
            if (v.isPrimary) {
                reconciledTarget.unshift({
                    institution_id: v.id,
                    major_id: v.major.id
                });
            } else {
                reconciledTarget.push({
                    institution_id: v.id,
                    major_id: v.major.id
                });
            }
        }

        try {
            await updateTarget(reconciledTarget);
            toast.success('Berhasil memperbarui target utama', {
                position: 'top-center',
                theme: 'colored',
                hideProgressBar: true
            });
        } catch (error) {
            console.error(
                new Error('failed to update primary target institutions', {
                    cause: error
                })
            );
            toast.error('Gagal memperbarui target utama, mohon coba kembali', {
                position: 'top-center',
                theme: 'colored',
                hideProgressBar: true
            });
        } finally {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (Array.isArray(data) && data.length > 0) {
            setTargetInstitutions(
                data.map((v, index) => ({ ...v, isPrimary: index === 0 }))
            );
        }
    }, [data]);

    return (
        <Modal
            permanent
            isOpen={isOpen}
            setOpen={() => setIsOpen(false)}
            containerClassName="modal modal-open modal-bottom lg:modal-middle min-h-[100px]"
            variant="dark"
            className="bg-[#20222E] p-4">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-white font-semibold leading-[140%]">
                        Ganti Target Utama
                    </h2>

                    <button
                        onClick={() => setIsOpen(false)}
                        type="button"
                        className="shrink-0">
                        <XIcon className="text-[#4D5165] hover:opacity-75 transition-all w-6 h-6" />
                    </button>
                </div>

                {isLoadingTarget ? (
                    <div className="space-y-3">
                        <div className="animate-pulse bg-[#333333] w-full h-16 rounded-lg"></div>
                        <div className="animate-pulse bg-[#333333] w-full h-16 rounded-lg"></div>
                        <div className="animate-pulse bg-[#333333] w-full h-16 rounded-lg"></div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {targetInstitutions.map((v, index) => (
                            <button
                                disabled={isLoadingUpdateTarget}
                                key={`${v.id}:${v.major.id}`}
                                onClick={() => selectTarget(index)}
                                type="button"
                                className={cn(
                                    'shrink-0 p-3 border border-transparent rounded-lg flex items-center gap-3 w-full hover:opacity-75 transition-all',
                                    v.isPrimary
                                        ? 'bg-[#5F2BCE] border-[#B6A6F3]'
                                        : 'bg-[#282B3C]'
                                )}>
                                {v.isPrimary ? (
                                    <FaCircleCheck className="text-white w-4 h-4" />
                                ) : (
                                    <FaRegCircle className="text-white w-4 h-4" />
                                )}

                                <div className="flex flex-col items-start gap-1">
                                    <div className="text-white font-semibold text-sm leading-tight">
                                        {v.major.name}
                                    </div>

                                    <div className="text-white text-xs leading-[140%]">
                                        {v.name}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                    <button
                        disabled={isLoadingTarget || isLoadingUpdateTarget}
                        type="button"
                        className="bg-transparent py-2 border border-[#333333] rounded-full text-white font-semibold leading-[140%] hover:opacity-75 disabled:opacity-75 transition-all"
                        onClick={handleClickButton}>
                        Ubah
                    </button>

                    <button
                        disabled={isLoadingTarget || isLoadingUpdateTarget}
                        onClick={handleUpdateTarget}
                        type="button"
                        className="bg-[#5F2BCE] py-2 border border-transparent rounded-full text-white font-semibold leading-[140%] hover:opacity-75 disabled:opacity-75 transition-all">
                        Ganti
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export { UpdatePrimaryTargetModal };
