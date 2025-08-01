import { Info, PenLine } from 'lucide-react';
import { useRouter } from 'next/router';
import {
    useDeleteUserCardMutation,
    useGetUserCardQuery
} from 'payment/redux/api/transactionApi';
import React, { useState } from 'react';
import { HiOutlineCreditCard, HiShieldCheck } from 'react-icons/hi';
import CardProtectionModal from './modals/CardProtectionModal';
import CreditCardSmallIcon from 'commons/components/elements/Icons/CreditCardSmall';
import { CDN_URL } from 'commons/constants';
import Image from 'next/image';
import Button from 'commons/components/elements/Button';
import ConfirmDeleteCardModal from './modals/ConfirmDeleteCardModal';
import { toast } from 'react-toastify';
import EditCardModal from './modals/EditCardModal';
import Skeleton from 'commons/components/elements/Skeleton';

const CreditCardDetails = (): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const [showProtectionModal, setShowProtectionModal] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [showEditCardModal, setShowEditCardModal] = useState(false);

    if (!router.isReady || typeof id !== 'string') {
        return <Skeleton repeat={3} className="w-full h-20" />;
    }

    const { data, isLoading, error } = useGetUserCardQuery(id);
    const [deleteUserCard, { isLoading: isDeleting }] =
        useDeleteUserCardMutation();

    if (isLoading) return <Skeleton repeat={3} className="w-full h-20" />;
    if (!data || error) return <p>Gagal memuat detail kartu.</p>;

    const getCardLogo = (brand: string): JSX.Element => {
        if (['MASTERCARD', 'VISA', 'AMEX', 'JCB'].includes(brand)) {
            return (
                <Image
                    src={`${CDN_URL}/assets/payments/${brand.toLowerCase()}.png`}
                    className="object-contain"
                    width={24}
                    height={24}
                />
            );
        } else {
            return <HiOutlineCreditCard className="text-[#5F2BCE]" size={24} />;
        }
    };

    const handleDelete = async (): Promise<void> => {
        try {
            await deleteUserCard(id).unwrap();
            await router.push('/profil/kartu-kredit');
            toast.success('Kartu kredit/debit berhasil dihapus', {
                position: 'top-center',
                toastId: 'CARD_DELETE'
            });
        } catch (err) {
            console.error('Failed to delete card', err);
        }
    };

    return (
        <>
            <div className="flex flex-col w-full max-h-[75vh] overflow-y-auto p-4 space-y-6">
                <div className="flex items-center gap-x-3 bg-[#03AC5C]/10 p-4 rounded-lg text-green-400">
                    <HiShieldCheck
                        size={20}
                        className="w-5 h-5 flex-shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                        <span className="font-medium">
                            Detail Kartumu Terlindungi
                        </span>
                        <p className="text-sm text-green-200">
                            CVV tidak disimpan, akan diminta setiap transaksi
                        </p>
                    </div>
                    <button
                        onClick={() => setShowProtectionModal(true)}
                        className="p-1 flex-shrink-0 rounded hover:bg-green-800 transition-colors">
                        <Info className="w-4 h-4" />
                    </button>
                </div>
                <div className="bg-[#222222] rounded-xl px-4 shadow-lg">
                    <div className="flex items-center justify-between mt-6">
                        <div className="w-10 h-10 rounded-full bg-[#00AA99]/15 flex items-center justify-center">
                            <CreditCardSmallIcon />
                        </div>
                        <div className="flex items-center space-x-2 mr-2">
                            <div
                                className={`w-2 h-2 rounded-full ${
                                    data.needs_refresh
                                        ? 'bg-red-500'
                                        : 'bg-green-500'
                                }`}
                            />
                            <span
                                className={`text-sm font-thin ${
                                    data.needs_refresh
                                        ? 'text-red-400'
                                        : 'text-green-400'
                                }`}>
                                {data.needs_refresh ? 'Expired' : 'Active'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-6 mx-2">
                        <div className="border-r border-gray-400 pr-4">
                            <span className="text-white font-semibold">
                                {data.brand}
                            </span>
                        </div>
                        <span className="text-white font-semibold">
                            {data.name}
                        </span>
                        <button
                            className="flex justify-center items-center w-6 h-6 p-1 rounded-full bg-[#333333] text-gray-400 hover:bg-gray-400 hover:text-white transition-colors"
                            onClick={() => setShowEditCardModal(true)}>
                            <PenLine className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex justify-between items-center space-x-4 mx-2 my-6">
                        <span className="text-white font-mono tracking-wider text-lg">
                            •••• •••• •••• ••••
                        </span>
                        <div className="bg-white rounded-md flex items-center justify-center p-1 overflow-hidden">
                            {getCardLogo(data.brand)}
                        </div>
                    </div>
                </div>
                <Button
                    variant="custom"
                    className="bg-[#FF3B30] w-1/2 self-center"
                    onClick={() => setShowConfirmDeleteModal(true)}>
                    Hapus Kartu
                </Button>
            </div>
            <CardProtectionModal
                isOpen={showProtectionModal}
                setOpen={setShowProtectionModal}
            />
            <ConfirmDeleteCardModal
                isOpen={showConfirmDeleteModal}
                setOpen={setShowConfirmDeleteModal}
                confirmButtonDisabled={isDeleting}
                onConfirm={handleDelete}
            />
            <EditCardModal
                isOpen={showEditCardModal}
                setOpen={setShowEditCardModal}
                currentName={data.name}
                cardId={data.id}
            />
        </>
    );
};

export default CreditCardDetails;
