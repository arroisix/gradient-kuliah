import Button from 'commons/components/elements/Button';
import { AiFillBank } from 'react-icons/ai';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

const OtherPaymentBox = (): JSX.Element => {
    return (
        <div className="rounded-lg bg-neutral-900 p-8 w-full mt-4 mb-16">
            <div className="mb-4 flex items-center">
                <AiFillBank className="text-base mr-2" />
                <h3 className="text-base font-bold">Lainnya</h3>
            </div>
            <span className="text-base font-body text-neutral-200">
                Untuk metode pembayaran selain bank yang tersedia dapat
                dilakukan dengan menguhungi Customer Service kami.
            </span>
            <div className="flex gap-4 md:gap-2 my-4 flex-wrap">
                <Button
                    variant="primary"
                    className="bg-[#0F460F] w-full md:w-fit"
                    href="https://api.whatsapp.com/send?phone=+6285775405765">
                    <span className="text-base font-bold flex items-center justify-center">
                        <FaWhatsapp className="mr-2 text-xl" />
                        Gabung Gradient
                    </span>
                </Button>
                <Button
                    variant="primary"
                    className="w-full md:w-fit"
                    href="https://www.instagram.com/gradient_idn/">
                    <span className="flex items-center justify-center">
                        <FaInstagram className="mr-2" /> Hubungi Kami
                    </span>
                </Button>
            </div>
        </div>
    );
};

export default OtherPaymentBox;
