export const COPYWRITING: LandingHeroCopywritingInterface = {
    title: {
        authenticated: 'Langganan Untuk Mengakses Seluruh Materi',
        unauthenticated: (
            <>
                Aplikasi{' '}
                <span className="text-[#7264EB]"> Belajar Kuliah </span>{' '}
                Terlengkap di Indonesia
            </>
        )
    },
    description:
        'Dapatkan akses ke video kelas, pembahasan soal, textbook, dan rangkuman untuk membantu kamu meraih IPK idaman',
    primaryButton: {
        authenticated: 'Langganan',
        unauthenticated: 'Daftar'
    },
    secondaryButton: {
        authenticated: 'Belum Yakin? Tanya ke Admin!',
        unauthenticated: 'Telusuri'
    }
};
