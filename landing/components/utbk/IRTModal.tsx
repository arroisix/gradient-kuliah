import Button from 'commons/components/elements/Button';
import Modal from 'commons/components/modules/Modal';
import { Dispatch, SetStateAction } from 'react';
import { FaChevronRight } from 'react-icons/fa';

interface IRTModalProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function IRTModal({
    open,
    setOpen
}: IRTModalProps): JSX.Element {
    return (
        <Modal
            isOpen={open}
            setOpen={setOpen}
            variant="dark"
            containerClassName="modal modal-open modal-middle min-h-[100px]"
            className="md:max-w-[660px] p-4 md:p-6">
            <div className="-mt-6 gap-4 flex flex-col text-white">
                <h3 className="text-xl leading-[140%] font-semibold">
                    Apa itu IRT?
                </h3>
                <div className="text-sm leading-[160%] flex flex-col gap-6">
                    <p>
                        IRT adalah sistem penilaian UTBK yang{' '}
                        <b className="font-semibold">
                            tidak menyamakan semua soal.
                        </b>{' '}
                        Nilai kamu ditentukan bukan cuma dari jumlah benar, tapi
                        juga{' '}
                        <b className="font-semibold">
                            tingkat kesulitan soal yang kamu jawab.
                        </b>
                    </p>
                    <div className="flex flex-col gap-6 md:flex-row">
                        <p className="p-4 bg-violet-3 rounded-2xl flex flex-col gap-4 font-semibold basis-1/2">
                            🏫 Sistem Ujian Sekolah
                            <ul className="pl-5 text-[#DEDEDE] font-normal">
                                <li>Semua soal bernilai sama.</li>
                                <li>
                                    Jawaban benar dihitung satu per satu, tanpa
                                    melihat soal itu mudah atau sulit.
                                </li>
                            </ul>
                        </p>
                        <p className="p-4 bg-[#5F2BCE] bg-opacity-20 rounded-2xl flex flex-col gap-4 font-semibold border-solid border-[1px] border-accent-purple basis-1/2">
                            🎓 Sistem UTBK (IRT)
                            <ul className="pl-5 leading-[125%]">
                                <li>Setiap soal punya bobot berbeda.</li>
                                <li>
                                    Menjawab soal yang lebih sulit memberi
                                    dampak skor lebih besar dibanding soal yang
                                    mudah.
                                </li>
                            </ul>
                        </p>
                    </div>
                    <p>
                        Artinya, jika kamu bisa menjawab soal yang banyak
                        peserta lain gagal, skormu bisa naik lebih signifikan.
                    </p>
                    <p>
                        Gradient menggunakan sistem ini supaya kamu melihat{' '}
                        <b className="font-semibold">
                            perkiraan skor yang lebih mendekati hasil UTBK
                            sebenarnya, bukan sekadar jumlah jawaban benar.
                        </b>
                    </p>
                    <Button
                        href="/utbk/try-out"
                        variant="primary"
                        className="flex items-center justify-center text-sm leading-[125%] gap-[6px] font-semibold"
                        linkClass="w-max self-center md:self-end">
                        Cek Try Out UTBK Gradient <FaChevronRight size={12} />
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
