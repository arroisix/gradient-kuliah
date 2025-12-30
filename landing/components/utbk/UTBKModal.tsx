import Button from 'commons/components/elements/Button';
import Modal from 'commons/components/modules/Modal';
import { CDN_URL } from 'commons/constants';
import { MATERI } from 'landing/constants/UTBK';
import { Dispatch, SetStateAction } from 'react';
import { FaChevronRight } from 'react-icons/fa';

interface UTBKModalProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function UTBKModal({
    open,
    setOpen
}: UTBKModalProps): JSX.Element {
    return (
        <Modal
            isOpen={open}
            setOpen={setOpen}
            variant="dark"
            containerClassName="modal modal-open modal-middle min-h-[100px]"
            className="md:max-w-[660px] p-4 md:p-6">
            <div className="-mt-6 gap-4 md:gap-6 flex flex-col text-white">
                <iframe
                    title="UTBK Yuk"
                    src="https://www.youtube.com/embed/tgbNymZ7vqY"
                    className="w-[calc(100%+32px)] md:w-[calc(100%+48px)] aspect-[343/176] md:aspect-[660/370] -mx-4 -mt-4 md:-mx-6 md:-mt-6"></iframe>
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl leading-[140%] font-semibold">
                            Kenalan dengan UTBK, yuk! 👋
                        </h3>
                        <p className="text-[#DEDEDE] text-sm leading-[160%]">
                            UTBK adalah tes masuk perguruan tinggi negeri. Tes
                            ini tidak menilai seberapa banyak materi yang kamu
                            hafal, tapi seberapa baik kamu memahami soal,
                            berpikir logis, dan menarik jawaban yang tepat.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-base leading-[140%] font-semibold">
                            Apa bedanya dengan Ujian Sekolah?
                        </h4>
                        <div className="flex flex-col gap-6 md:flex-row">
                            <p className="p-4 bg-violet-3 rounded-2xl flex flex-col gap-4 font-semibold basis-1/2 text-sm leading-[125%]">
                                🏫 Ujian Sekolah
                                <ul className="pl-5 text-[#DEDEDE] font-normal leading-[160%]">
                                    <li>Banyak mengandalkan hafalan materi</li>
                                    <li>
                                        Rumus sering harus diingat di luar
                                        kepala
                                    </li>
                                    <li>Fokus ke isi pelajaran di kelas</li>
                                </ul>
                            </p>
                            <p className="text-sm leading-[125%] p-4 bg-[#5F2BCE] bg-opacity-20 rounded-2xl flex flex-col gap-4 font-semibold border-solid border-[1px] border-accent-purple basis-1/2">
                                🎓 UTBK
                                <ul className="pl-5 leading-[125%]">
                                    <li>Menguji cara berpikir dan logika</li>
                                    <li>
                                        Menilai pemahaman konsep dasar, bukan
                                        hafalan
                                    </li>
                                    <li>
                                        Menguji kemampuan membaca dan memahami
                                        teks
                                    </li>
                                </ul>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-base leading-[140%] font-semibold">
                            Apa saja yang diuji?
                        </h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                            {MATERI.map((i) => (
                                <li
                                    key={i.name}
                                    className="flex gap-4 p-3 bg-violet-1 items-center rounded-lg">
                                    <div className="h-[48px] w-[48px] flex items-center justify-center rounded-full bg-violet-3 text-white flex-shrink-0">
                                        <img
                                            src={`${CDN_URL}/assets/utbk/${i.icon}`}
                                            alt={i.name}
                                        />
                                    </div>
                                    <p className="text-base leading-[140%] font-semibold">
                                        {i.name}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Button
                        href="/materi"
                        variant="primary"
                        className="flex items-center justify-center text-sm leading-[125%] gap-[6px] font-semibold"
                        linkClass="w-max self-center md:self-end">
                        Cek Materi UTBK Gradient <FaChevronRight size={12} />
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
