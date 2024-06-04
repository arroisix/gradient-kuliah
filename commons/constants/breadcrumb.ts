export const BREADCRUMB: BreadcrumbProps = {
    '/kelas': {
        name: 'Kelas'
    },
    '/komunitas/public': {
        name: 'Komunitas'
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
    '/perpustakaan/bank-soal': {
        name: 'Perpustakaan',
        url: '/perpustakaan',
        nextItem: {
            name: 'Bank Soal'
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
    }
};
