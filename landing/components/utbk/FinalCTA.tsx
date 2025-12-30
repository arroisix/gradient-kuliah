import Button from 'commons/components/elements/Button';
import { CDN_URL } from 'commons/constants';
import { cn } from 'commons/utils';
import styles from 'styles/utbk.module.css';

interface FinalCTAProps {
    className?: string;
}

export default function FinalCTA({ className }: FinalCTAProps): JSX.Element {
    return (
        <section
            className={cn(
                'rounded-3xl border-solid border-[1px] border-white border-opacity-10 py-[40px] px-[43px] sm:px-[29px] max-w-[1028px] self-center w-full flex flex-col',
                className
            )}
            style={{
                background: 'linear-gradient(90deg, #111827 0%, #000000 100%)'
            }}>
            <div className="flex flex-col gap-8 items-center xl:max-w-[676px] sm:max-w-[612px] min-w-[287px] self-center">
                <img
                    src={`${CDN_URL}/assets/utbk/indonesia_asset.svg`}
                    alt="Peta pengguna Gradient di seluruh Indonesia."
                    height={100}
                    className="w-full h-auto"
                />
                <div className="flex flex-col w-full text-center gap-4 z-0">
                    <h2 className="text-white text-3xl font-bold">
                        <span
                            className={cn(
                                'relative inline-flex justify-center',
                                styles['final-cta-decor']
                            )}>
                            200.000+ pelajar
                        </span>
                        <br className="sm:hidden" /> di Indonesia menggunakan
                        <br className="hidden sm:block" /> Gradient
                    </h2>
                    <p className="text-[#9CA3AF]">
                        Daftar untuk mengakses preview materi GRATIS
                    </p>
                    <Button
                        variant="primary"
                        linkClass="h-[52px] sm:max-w-[160px] w-full self-center"
                        className="h-full flex items-center justify-center"
                        href="/daftar">
                        Coba Gratis
                    </Button>
                </div>
            </div>
        </section>
    );
}
