import Button from 'commons/components/elements/Button';
import { getCSChatRoom } from 'commons/utils';
import { addZeroBefore } from 'courses/utils';
import { forwardRef } from 'react';
import { AiFillBank } from 'react-icons/ai';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

const OtherPaymentBox = forwardRef<HTMLDivElement>(function OtherPaymentBox(
    _,
    forwardedRef
) {
    const currentDate = new Date();

    return (
        <div
            ref={forwardedRef}
            className="w-full p-8 mt-4 mb-16 rounded-lg bg-neutral-900">
            <div className="flex items-center mb-4">
                <AiFillBank className="mr-2 text-base" />
                <h3 className="text-base font-bold">Lainnya</h3>
            </div>
            <span className="text-base font-body text-neutral-200">
                Metode pembayaran selain yang tersedia dapat dilakukan dengan
                menghubungi Customer Service kami.
            </span>
            <div className="flex flex-wrap gap-4 my-4 md:gap-2">
                <Button
                    variant="primary"
                    className="!bg-[#0F460F] w-full md:w-fit"
                    onClick={() =>
                        window.open(
                            getCSChatRoom(
                                'LINE',
                                encodeURIComponent(
                                    `Halo, Saya tertarik untuk berlangganan\n\n[ID:${currentDate.getDate()}${addZeroBefore(
                                        currentDate.getMonth() + 1
                                    )}${currentDate.getFullYear()}]`
                                )
                            )
                        )
                    }>
                    <span className="flex items-center justify-center text-base font-bold">
                        <FaWhatsapp className="mr-2 text-xl" />
                        Hubungi Kami
                    </span>
                </Button>
                <Button
                    variant="primary"
                    className="w-full md:w-fit"
                    onClick={() =>
                        window.open('https://www.instagram.com/gradient_idn/')
                    }>
                    <span className="flex items-center justify-center">
                        <FaInstagram className="mr-2" /> Hubungi Kami
                    </span>
                </Button>
            </div>
        </div>
    );
});

export default OtherPaymentBox;
