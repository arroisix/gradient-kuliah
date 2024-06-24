export const BREADCRUMB: BreadcrumbProps = {
    '/kelas': {
        name: 'Kelas'
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
    '/perpustakaan/textbook/[slug]/[problemId]': {
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
    '/perpustakaan/bank-soal/[slug]/[page]': {
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
    }
};
