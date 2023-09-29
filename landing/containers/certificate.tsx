import Button from 'commons/components/elements/Button';
import Image from 'next/image';
import Link from 'next/link';

const Certificate = (): JSX.Element => {
    return (
        <section className="flex flex-col md:flex-row justify-center items-center md:gap-4 md:w-[70%] mx-auto px-[18px] pt-4 md:pt-[72px] pb-0">
            <div className="w-full h-[200px] md:w-1/2 md:h-[320px] relative">
                <Image
                    src={
                        'https://assets.gradient.academy/assets/certificate.png'
                    }
                    loading="lazy"
                    sizes="none"
                    layout="fill"
                    className="object-contain"
                />
            </div>
            <div className="flex flex-col gap-4 md:gap-5 w-full md:w-1/2 text-center md:text-left">
                <h3 className="font-extrabold text-xl md:text-4xl">
                    Ayo gabung sekarang!
                </h3>
                <span className="inline-block pb-1 md:pb-5 text-[#999999] text-xs md:text-2xl">
                    Dapatkan sertifikat setiap menyelesaikan semua kelas yang
                    kamu ikuti.
                </span>
                <Link href={'#pricing'}>
                    <Button
                        variant="primary"
                        className="w-fit mx-auto md:m-0 px-6 py-3 text-base"
                        eventName="Landing Page CTA"
                        eventPayload={{ 'Section Name': 'Certificate' }}>
                        Gabung Sekarang
                    </Button>
                </Link>
            </div>
        </section>
    );
};

export default Certificate;
