'use client';
import { useState } from 'react';
import { X, Info } from 'lucide-react';
import Modal from 'commons/components/modules/Modal';
import Input from 'commons/components/elements/Form/input';
import Button from 'commons/components/elements/Button';
// import CardProtectionModal from './CardProtectionModal';
// import CVVInfoModal from './CVVInfoModal';

const TambahKartuKreditForm = (): JSX.Element => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [isProtectionModalOpen, setIsProtectionModalOpen] = useState(false);
    const [isCVVModalOpen, setIsCVVModalOpen] = useState(false);

    const handleSubmit = () => {
        // TODO: Implement card submission logic
        console.log('Submitting card:', { cardNumber, expiryDate, cvv });
        // onClose();
    };

    const formatCardNumber = (value: string) => {
        // Remove all non-digits
        const digits = value.replace(/\D/g, '');
        // Add spaces every 4 digits
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const formatExpiryDate = (value: string) => {
        // Remove all non-digits
        const digits = value.replace(/\D/g, '');
        // Add slash after 2 digits
        if (digits.length >= 2) {
            return digits.substring(0, 2) + '/' + digits.substring(2, 4);
        }
        return digits;
    };

    return (
        <>
            <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">
                        Tambah Kartu Baru
                    </h2>
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Security Info */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-green-400 text-sm font-medium">
                            Detail Kartumu Terlindungi
                        </span>
                        <button
                            onClick={() => setIsProtectionModalOpen(true)}
                            className="text-green-400 hover:text-green-300 transition-colors">
                            <Info size={16} />
                        </button>
                    </div>
                    <p className="text-gray-400 text-xs ml-5">
                        CVV tidak disimpan, akan diminta setiap transaksi
                    </p>
                </div>

                {/* Card Icons */}
                <div className="flex justify-end gap-2 mb-4">
                    <div className="w-8 h-5 bg-gradient-to-r from-orange-400 to-red-500 rounded"></div>
                    <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                            VISA
                        </span>
                    </div>
                    <div className="w-8 h-5 bg-blue-800 rounded"></div>
                    <div className="w-8 h-5 bg-blue-900 rounded"></div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    {/* Card Details Section */}
                    <div>
                        <h3 className="text-white font-medium mb-3">
                            Rincian Kartu
                        </h3>

                        {/* Card Number */}
                        <div className="mb-4">
                            <label className="text-gray-400 text-sm mb-2 block">
                                Nomor Kartu
                            </label>
                            <Input
                                type="text"
                                name="cardNumber"
                                placeholder="XXXX XXXX XXXX XXXX"
                                value={cardNumber}
                                onChange={(e) =>
                                    setCardNumber(
                                        formatCardNumber(e.target.value)
                                    )
                                }
                                className="bg-[#2a2a2a] border-[#3a3a3a]"
                            />
                        </div>

                        {/* Expiry Date and CVV */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-gray-400 text-sm mb-2 block">
                                    Tanggal Kedaluwarsa
                                </label>
                                <Input
                                    type="text"
                                    name="expiryDate"
                                    placeholder="MM/YY"
                                    value={expiryDate}
                                    onChange={(e) =>
                                        setExpiryDate(
                                            formatExpiryDate(e.target.value)
                                        )
                                    }
                                    className="bg-[#2a2a2a] border-[#3a3a3a]"
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm mb-2 block">
                                    CVV
                                </label>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        name="cvv"
                                        placeholder="XXX"
                                        value={cvv}
                                        onChange={(e) =>
                                            setCvv(
                                                e.target.value
                                                    .replace(/\D/g, '')
                                                    .substring(0, 4)
                                            )
                                        }
                                        className="bg-[#2a2a2a] border-[#3a3a3a] pr-10"
                                    />
                                    <button
                                        onClick={() => setIsCVVModalOpen(true)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                                        <Info size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8">
                    <p className="text-gray-400 text-xs text-center mb-4">
                        Dengan konfirmasi, kamu menyetujui{' '}
                        <span className="text-blue-400">
                            Syarat & Ketentuan
                        </span>{' '}
                        serta{' '}
                        <span className="text-blue-400">Kebijakan Privasi</span>
                    </p>
                    <Button variant="primary" onClick={handleSubmit}>
                        Konfirmasi
                    </Button>
                </div>
            </div>

            {/* Info Modals
            <CardProtectionModal
                isOpen={isProtectionModalOpen}
                onClose={() => setIsProtectionModalOpen(false)}
            />
            <CVVInfoModal
                isOpen={isCVVModalOpen}
                onClose={() => setIsCVVModalOpen(false)}
            /> */}
        </>
    );
};

export default TambahKartuKreditForm;
