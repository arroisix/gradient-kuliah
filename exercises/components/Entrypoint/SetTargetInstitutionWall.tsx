import Button from 'commons/components/elements/Button';
import Image from 'next/image';
import { useSetTargetDrawerContext } from './SetTargetDrawer';
import { useWindowSize } from 'usehooks-ts';

function SetTargetInstitutionWall(): JSX.Element {
    const { setIsDrawerOpened } = useSetTargetDrawerContext();
    const { width } = useWindowSize();

    return (
        <div className="min-h-[calc(100vh-64px-20px-32px)]">
            <section className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full max-w-[520px] space-y-6 px-6 py-8 mx-auto">
                <div className="w-fit mx-auto">
                    <Image
                        src="https://assets.gradient.academy/assets/target_institution_Ilustration.png"
                        loading="lazy"
                        width={120}
                        height={120}
                        className="select-none pointer-events-none"
                    />
                </div>

                <div
                    className={`${
                        width < 768 ? '' : 'px-[25px]'
                    } text-center space-y-3`}>
                    <h2 className="text-white font-bold text-xl">
                        Siap untuk{' '}
                        <span className="text-[#B6A6F3]">UTBK 2026?</span>
                    </h2>
                    <p className="text-[#999999]">
                        Sebelum mulai, tentukan dulu kampus dan jurusan
                        impianmu. Kami akan menyesuaikan bobot soal sesuai
                        targetmu.
                    </p>
                </div>

                <Button
                    variant="primary"
                    size="large"
                    className="w-full max-w-[328px] block mx-auto !py-3"
                    onClick={() => setIsDrawerOpened(true)}>
                    Tentukan Target
                </Button>
            </section>
        </div>
    );
}

export default SetTargetInstitutionWall;
