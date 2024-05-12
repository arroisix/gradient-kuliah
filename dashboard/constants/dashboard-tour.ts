import { type Config } from 'driver.js';

export const dashboardTourConfig: Config = {
    popoverClass: 'dashboard-tour',
    showProgress: true,
    showButtons: ['next'],
    steps: [
        {
            element: '[data-tour="step-1"]',
            popover: {
                description: 'Selamat datang! Mulai kelas pertamamu di sini',
                side: 'top',
                align: 'center'
            }
        },
        {
            element: '[data-tour="step-2"]',
            popover: {
                description: 'Kerjain latihan soal, lengkap sama jawabannya',
                side: 'top',
                align: 'center'
            }
        },
        {
            element: '[data-tour="step-3"]',
            popover: {
                description: 'Males nyatet? Baca rangkuman aja!',
                side: 'top',
                align: 'center'
            }
        },
        {
            element: '[data-tour="step-4"]',
            popover: {
                description: 'Bingung? Tanya di Gradient, pasti dapet jawaban',
                side: 'top',
                align: 'end'
            }
        }
    ]
};
