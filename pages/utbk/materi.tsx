import { useAuth } from 'authentication/contexts/AuthProvider';
import LearnLayout from 'commons/learnLayout';
import Layout from 'commons/utbkLayout';
import Image from 'next/image';
import { useRouter } from 'next/router';

const MateriPage = (): JSX.Element => {
    const router = useRouter();
    const { isLoadingProfile, isAuthenticated } = useAuth();

    // it's necessary to prevent glitch
    // proper loading state will be addressed later
    if (isLoadingProfile === undefined || isLoadingProfile) {
        return <></>;
    }

    if (!isAuthenticated) {
        router.replace('/utbk');
        return (
            <Layout>
                <div className="w-screen h-screen"></div>
            </Layout>
        );
    }

    return (
        <LearnLayout showSidebar fullHeightSidebar className="relative">
            <div className="relative w-full h-[calc(100vh-128px)]">
                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full max-w-[361px]">
                    <div className="relative w-full max-w-[340px] h-[232px]">
                        <div className="absolute z-10 top-0 left-0">
                            <Image
                                src="https://assets.gradient.academy/assets/materi_coming_soon_2.png"
                                alt=""
                                quality={100}
                                width={236}
                                height={188}
                            />
                        </div>
                        <div className="absolute z-20 bottom-0 right-0">
                            <Image
                                src="https://assets.gradient.academy/assets/materi_coming_soon_1.png"
                                alt=""
                                quality={100}
                                width={236}
                                height={188}
                            />
                        </div>
                    </div>

                    <h1 className="text-center font-bold text-2xl text-white mb-3 mt-6">
                        Materi UTBK Segera Hadir
                    </h1>

                    <p className="text-center text-[#999999] text-sm">
                        Materi UTBK terstruktur untuk bantu kamu belajar lebih
                        fokus.
                    </p>

                    <div className="bg-[#282B3C] p-4 rounded-2xl mt-6">
                        <h2 className="text-white font-semibold mb-4">
                            Yang akan kamu dapatkan
                        </h2>

                        <ul className="space-y-2 p-0">
                            <li className="flex items-center gap-3">
                                <div className="shrink-0">
                                    <Image
                                        src="https://assets.gradient.academy/assets/materi_coming_soon_video.svg"
                                        alt=""
                                        width={24}
                                        height={24}
                                    />
                                </div>{' '}
                                Video pembelajaran per subtes.
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="shrink-0">
                                    <Image
                                        src="https://assets.gradient.academy/assets/materi_coming_soon_mentor.svg"
                                        alt=""
                                        width={24}
                                        height={24}
                                    />
                                </div>{' '}
                                Mentor dari kakak mahasiswa dari universitas
                                top.
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="shrink-0">
                                    <Image
                                        src="https://assets.gradient.academy/assets/materi_coming_soon_bank.svg"
                                        alt=""
                                        width={24}
                                        height={24}
                                    />
                                </div>{' '}
                                Bank soal dengan pembahasan.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </LearnLayout>
    );
};

MateriPage.displayName = 'Materi';
export default MateriPage;
