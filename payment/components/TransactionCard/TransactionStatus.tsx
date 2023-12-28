import React from 'react';
import { AiFillClockCircle, AiFillCloseCircle } from 'react-icons/ai';
import { HiCheckCircle } from 'react-icons/hi';

type TransactionStatusProps = {
    isExpiry: boolean;
    status: Transaction['status'];
};

const TransactionStatus = ({
    isExpiry,
    status
}: TransactionStatusProps): JSX.Element => {
    if (isExpiry && status !== 'SUCCESS') {
        return (
            <div className="flex items-center gap-[8px] text-state-error">
                <AiFillCloseCircle size={16} />
                <span className="text-sm inline-body font-body">
                    Pembayaran Gagal
                </span>
            </div>
        );
    }
    switch (status) {
        case 'SUCCESS':
            return (
                <div className="flex items-center gap-[8px] text-state-success">
                    <HiCheckCircle size={16} />
                    <span className="text-sm inline-body font-body">
                        Pembayaran Selesai
                    </span>
                </div>
            );
        case 'WAITING':
            return (
                <div className="flex items-center gap-[8px] text-accent-yellow">
                    <AiFillClockCircle size={16} />
                    <span className="text-sm inline-body font-body">
                        Menunggu Pembayaran
                    </span>
                </div>
            );
        case 'EXPIRY':
            return (
                <div className="flex items-center gap-[8px] text-state-error">
                    <AiFillCloseCircle size={16} />
                    <span className="text-sm inline-body font-body">
                        Pembayaran Gagal
                    </span>
                </div>
            );
        default:
            return <></>;
    }
};

export default TransactionStatus;
