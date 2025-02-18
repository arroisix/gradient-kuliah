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
        'Akses video, pembahasan soal, rangkuman, dan alat belajar dengan dukungan AI untuk membantumu raih IPK idaman',
    primaryButton: {
        authenticated: 'Langganan',
        unauthenticated: 'Daftar'
    },
    secondaryButton: {
        authenticated: 'Belum Yakin? Tanya ke Admin!',
        unauthenticated: 'Telusuri'
    }
};
