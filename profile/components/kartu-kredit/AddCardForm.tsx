'use client';
import { useState } from 'react';
import type React from 'react';

import { Info } from 'lucide-react';
import { HiShieldCheck } from 'react-icons/hi';
import Button from 'commons/components/elements/Button';
import CardProtectionModal from './CardProtectionModal';
import CVVInfoModal from './CVVInfoModal';

const AddCardForm = (): JSX.Element => {
    const [formData, setFormData] = useState({
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });
    const [showProtectionModal, setShowProtectionModal] = useState(false);
    const [showCVVModal, setShowCVVModal] = useState(false);

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiryDate = (value: string) => {
        const v = value.replace(/\D/g, '');
        if (v.length >= 2) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }
        return v;
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(e.target.value);
        if (formatted.length <= 19) {
            // 16 digits + 3 spaces
            setFormData((prev) => ({ ...prev, cardNumber: formatted }));
        }
    };

    const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatExpiryDate(e.target.value);
        if (formatted.length <= 5) {
            // MM/YY
            setFormData((prev) => ({ ...prev, expiryDate: formatted }));
        }
    };

    const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 4) {
            setFormData((prev) => ({ ...prev, cvv: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement card submission logic
        console.log('Form submitted:', formData);
    };

    return (
        <div className="min-h-screen text-white">
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-semibold">
                        Tambah Kartu Baru
                    </h1>
                    {/* <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                        <X className="w-6 h-6" />
                    </button> */}
                </div>

                {/* Protection Info */}
                <div className="mb-8 flex items-center gap-x-3 bg-[#03AC5C]/5 p-4 rounded-lg text-green-400">
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

                {/* Card Icons */}
                <div className="flex justify-end gap-2 mb-6">
                    <div className="w-10 h-6 bg-orange-500 rounded flex items-center justify-center text-xs font-bold text-white">
                        MC
                    </div>
                    <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-xs font-bold text-white">
                        VISA
                    </div>
                    <div className="w-10 h-6 bg-blue-500 rounded flex items-center justify-center text-xs font-bold text-white">
                        AE
                    </div>
                    <div className="w-10 h-6 bg-red-600 rounded flex items-center justify-center text-xs font-bold text-white">
                        JCB
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Card Details Section */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold">Rincian Kartu</h3>

                        {/* Card Name */}
                        <div>
                            <label className="block text-sm text-graphite-400 font-medium mb-2">
                                Nama Kartu
                            </label>
                            <input
                                type="text"
                                value={formData.cardName}
                                placeholder="Contoh: Kartu Utama, Kartu Ibu"
                                className="w-full px-4 py-3 bg-graphite-800 border border-graphite-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* Card Number */}
                        <div>
                            <label className="block text-sm text-graphite-400 font-medium mb-2">
                                Nomor Kartu
                            </label>
                            <input
                                type="text"
                                value={formData.cardNumber}
                                onChange={handleCardNumberChange}
                                placeholder="XXXX XXXX XXXX XXXX"
                                className="w-full px-4 py-3 bg-graphite-800 border border-graphite-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* Expiry Date and CVV */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-graphite-400 font-medium mb-2">
                                    Tanggal Kedaluwarsa
                                </label>
                                <input
                                    type="text"
                                    value={formData.expiryDate}
                                    onChange={handleExpiryDateChange}
                                    placeholder="MM/YY"
                                    className="w-full px-4 py-3 bg-graphite-800 border border-graphite-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <label className="block text-sm text-graphite-400 font-medium">
                                        CVV
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.cvv}
                                        onChange={handleCVVChange}
                                        placeholder="XXX"
                                        className="w-full px-4 py-3 bg-graphite-800 border border-graphite-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCVVModal(true)}
                                        className="absolute inset-y-0 right-3 flex items-center justify-center p-1">
                                        <Info className="w-4 h-4 text-accent-purple" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="pt-8 flex items-start gap-4">
                        <p className="flex-1 text-sm text-gray-400 mb-6">
                            Dengan konfirmasi, kamu menyetujui{' '}
                            <span className="text-blue-400 hover:underline cursor-pointer">
                                Syarat & Ketentuan
                            </span>{' '}
                            serta{' '}
                            <span className="text-blue-400 hover:underline cursor-pointer">
                                Kebijakan Privasi
                            </span>
                        </p>

                        {/* Submit Button */}
                        <Button variant="primary" className="flex-shrink-0">
                            Konfirmasi
                        </Button>
                    </div>
                </form>
            </div>

            {/* Modals */}
            <CardProtectionModal
                isOpen={showProtectionModal}
                setOpen={setShowProtectionModal}
            />
            <CVVInfoModal isOpen={showCVVModal} setOpen={setShowCVVModal} />
        </div>
    );
};

export default AddCardForm;
