export const BREADCRUMB: BreadcrumbProps = {
    '/kelas': {
        name: 'Kelas'
    },
    '/kelas/downloads': {
        name: 'Kelas',
        url: '/kelas',
        nextItem: {
            name: 'Lihat Download'
        }
    },
    '/kelas/[id]': {
        name: 'Kelas',
        url: '/kelas'
    },
    '/kelas/[id]/[slug]': {
        name: 'Kelas',
        url: '/kelas'
    },
    '/komunitas/public': {
        name: 'Komunitas'
    },
    '/komunitas/pertanyaan-ku': {
        name: 'Komunitas',
        url: '/komunitas',
        nextItem: {
            name: 'Pertanyaanku'
        }
    },
    '/komunitas/[category]': {
        name: 'Komunitas',
        url: '/komunitas'
    },
    '/komunitas/[category]/[id]': {
        name: 'Komunitas',
        url: '/komunitas'
    },
    '/perpustakaan': {
        name: 'Perpustakaan'
    },
    '/perpustakaan/astronotes': {
        name: 'Perpustakaan',
        url: '/perpustakaan',
        nextItem: {
            name: 'Astronotes'
        }
    },
    '/perpustakaan/astronotes/[slug]': {
        name: 'Perpustakaan',
        url: '/perpustakaan',
        nextItem: {
            name: 'Astronotes',
            url: '/perpustakaan/astronotes'
        }
    },
    '/perpustakaan/astronotes/[slug]/[page]': {
        name: 'Perpustakaan',
        url: '/perpustakaan',
        nextItem: {
            name: 'Astronotes',
            url: '/perpustakaan/astronotes'
        }
    },
    '/perpustakaan/textbook': {
        name: 'Perpustakaan',
        url: '/perpustakaan',
        nextItem: {
            name: 'Text Book'
        }
    },
    '/perpustakaan/textbook/[slug]': {
        name: 'Perpustakaan',
        url: '/perpustakaan',
        nextItem: {
            name: 'Text Book',
            url: '/perpustakaan/textbook'
        }
    },
    '/perpustakaan/textbook/[slug]/[problemSlug]': {
        name: 'Perpustakaan',
        url: '/perpustakaan',
        nextItem: {
            name: 'Text Book',
            url: '/perpustakaan/textbook'
        }
    },
    '/perpustakaan/bank-soal': {
        name: 'Perpustakaan',
        url: '/perpustakaan',
        nextItem: {
            name: 'Bank Soal'
        }
    },
    '/perpustakaan/bank-soal/[slug]': {
        name: 'Perpustakaan',
        url: '/perpustakaan',
        nextItem: {
            name: 'Bank Soal',
            url: '/perpustakaan/bank-soal'
        }
    },
    '/perpustakaan/bank-soal/[slug]/[problemSlug]': {
        name: 'Perpustakaan',
        url: '/perpustakaan',
        nextItem: {
            name: 'Bank Soal',
            url: '/perpustakaan/bank-soal'
        }
    },
    '/tentang-kami': {
        name: 'Tentang Kami'
    },
    '/kebijakan-privasi': {
        name: 'Kebijakan Privasi'
    },
    '/syarat-dan-ketentuan': {
        name: 'Syarat dan Ketentuan'
    },
    '/kontak-kami': {
        name: 'Kontak Kami'
    },
    '/search/results': {
        name: 'Hasil pencarian untuk'
    },
    '/search/results/[keywords]': {
        name: 'Hasil pencarian untuk'
    },
    '/latihan': {
        name: 'Try Out'
    },
    '/utbk/try-out': {
        name: 'Try Out'
    },
    '/testimonial': {
        name: 'Testimonial'
    },
    '/flashcards': {
        name: 'Flashcard'
    },
    '/flashcards/[slug]': {
        name: 'Flashcard',
        url: '/flashcards'
    },
    '/flashcards/[slug]/study': {
        name: 'Flashcard',
        url: '/flashcards'
    },
    '/flashcards/[slug]/edit-card': {
        name: 'Flashcard',
        url: '/flashcards'
    },
    '/alat-belajar': {
        name: 'Alat Belajar'
    }
};
