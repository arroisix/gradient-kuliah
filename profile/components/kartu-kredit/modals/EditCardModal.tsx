import Modal from 'commons/components/modules/Modal';
import { useState } from 'react';
import Button from 'commons/components/elements/Button';
import {
    useEditUserCardMutation,
    useLazyCheckUserCardNameAvailabilityQuery
} from 'payment/redux/api/transactionApi';
import { useDebouncedCallback } from 'use-debounce';
import { FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const MAX_NAME_LENGTH = 20;

interface EditCardModalProps extends ModalBaseProps {
    currentName: string;
    cardId: string;
}

const EditCardModal: React.FC<EditCardModalProps> = ({
    isOpen,
    setOpen,
    currentName,
    cardId
}) => {
    const [name, setName] = useState<string>(currentName);
    const [isNameAvailable, setIsNameAvailable] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState<string | undefined>();
    const [touched, setTouched] = useState(false);
    const [triggerCheckName, { isFetching: isCheckingName }] =
        useLazyCheckUserCardNameAvailabilityQuery();
    const [editUserCard, { isLoading: isEditing }] = useEditUserCardMutation();

    const debouncedCheckName = useDebouncedCallback(async (value: string) => {
        if (!value.trim()) return;
        const { status, isAvailable } = await triggerCheckName({
            card_name: value
        }).unwrap();

        setIsNameAvailable(isAvailable);
        setIsTyping(false);
        if (isAvailable || value === currentName) {
            setIsNameAvailable(true);
            setError(undefined);
        } else {
            if (status === 409) {
                setError('Label kartu sudah pernah digunakan');
            } else if (status === 406) {
                if (value.length > MAX_NAME_LENGTH) {
                    setError(`Maksimal ${MAX_NAME_LENGTH} karakter`);
                } else {
                    setError(
                        'Label kartu hanya boleh mengandung huruf dan angka'
                    );
                }
            }
        }
    }, 1000);

    const handleEdit = async (): Promise<void> => {
        if (name !== currentName) {
            await editUserCard({
                id: cardId,
                changes: {
                    name: name
                }
            }).unwrap();
            toast.success('Label kartu berhasil diubah', {
                position: 'top-center',
                toastId: 'CARD_EDIT'
            });
        }
        setOpen(false);
    };

    const Icon =
        isCheckingName || isTyping
            ? FaSpinner
            : isNameAvailable
            ? FaCheckCircle
            : FaTimesCircle;
    const iconClass =
        isCheckingName || isTyping
            ? 'animate-spin text-gray-400'
            : isNameAvailable
            ? 'text-green-500'
            : 'text-red-500';

    return (
        <Modal
            isOpen={isOpen}
            setOpen={setOpen}
            variant="dark"
            className="bg-[#222222]">
            <div className="flex flex-col space-y-4 pb-4 items-stretch">
                <h1 className="font-bold self-start">Rename</h1>
                <div
                    className={`flex flex-col items-stretch bg-[#2C2C2C] border rounded-lg ${
                        error ? 'border-red-500' : 'border-[#333333]'
                    }`}>
                    <textarea
                        value={name}
                        onChange={(e) => {
                            setTouched(true);
                            setIsNameAvailable(false);
                            setIsTyping(true);
                            setName(e.target.value);
                            debouncedCheckName(e.target.value);
                        }}
                        className="w-full h-full min-h-[64px] border-none focus:outline-none bg-transparent focus:ring-0 focus:appearance-none resize-none"
                    />
                    <div className="flex justify-end space-x-2 p-2 mt-2 items-center">
                        {touched && error && (
                            <span className="text-sm text-red-500 flex-1">
                                {error}
                            </span>
                        )}
                        {touched && <Icon className={iconClass} />}
                        <span className="text-sm font-light text-neutral-400">
                            {name.length}/{MAX_NAME_LENGTH}
                        </span>
                    </div>
                </div>
                <Button
                    variant="primary"
                    disabled={isCheckingName || !isNameAvailable || isEditing}
                    onClick={handleEdit}>
                    Simpan
                </Button>
            </div>
        </Modal>
    );
};

export default EditCardModal;
