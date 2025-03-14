module.exports = {
    content: [
        './authentication/**/**/*.{ts,js,jsx,tsx}',
        './landing/**/*.{ts,js,jsx,tsx}',
        './dashboard/**/*.{ts,js,jsx,tsx}',
        './courses/**/*.{ts,js,jsx,tsx}',
        './commons/**/*.{ts,js,jsx,tsx}',
        './pages/**/*.{ts,js,jsx,tsx}',
        './payment/**/*.{ts,js,jsx,tsx}',
        './profile/**/*.{ts,js,jsx,tsx}',
        './komunitas/**/*.{ts,js,jsx,tsx}',
        './referral/**/*.{ts,js,jsx,tsx}',
        './legal/**/*.{ts,js,jsx,tsx}',
        './copilot/**/*.{ts,js,jsx,tsx}',
        './flashcards/**/*.{ts,js,jsx,tsx}',
        './exercises/**/*.{ts,js,jsx,tsx}'
    ],
    darkMode: 'class',
    theme: {
        fontFamily: {
            sans: ['Raleway', 'sans-serif'],
            inter: ['Inter', 'sans-serif'],
            body: ['Open Sans', 'Roboto'],
            serif: ['Playfair Display', 'serif'],
            mono: ['Roboto Mono', 'serif']
        },
        extend: {
            boxShadow: {
                glowing: '0px 0px 26px rgba(255, 255, 255, 0.25);'
            },
            colors: {
                accent: {
                    blue: '#72B6E8',
                    purple: '#5F2BCE',
                    orange: '#B73E32',
                    yellow: '#F2C04C',
                    green: '#BCE2A4'
                },
                neutral: {
                    50: '#FFFFFF',
                    100: '#F2F4F4',
                    200: '#CCCCCC',
                    400: '#999999',
                    600: '#666666',
                    800: '#333333',
                    900: '#1D1D1D',
                    1000: '#000000'
                },
                graphite: {
                    50: '#FFFFFF',
                    100: '#F2F4F4',
                    200: '#CCCCCC',
                    400: '#999999',
                    600: '#666666',
                    700: '#333333',
                    800: '#242424',
                    900: '#121212',
                    1000: '#000000'
                },
                state: {
                    success: '#008800',
                    error: '#FF2D55'
                },
                primary: {
                    blue: '#0266D3'
                }
            },
            backgroundImage: {
                'gradient-purple':
                    'radial-gradient(60% 60% at 50% 50%, rgba(100, 75, 169, 0.53) 0%, #030317 100%)',
                'gradient-purple-thin':
                    'radial-gradient(60% 60% at 50% 50%, rgba(95, 43, 206, 0.5) 0%, rgba(0, 0, 0, 0) 70%)',
                'gradient-purple-pricing':
                    'radial-gradient(146.27% 146.27% at 50% 50%, rgba(95, 43, 206, 0.3) 0%, rgba(0, 0, 0, 0) 100%)',
                'gradient-highlighted-price':
                    'linear-gradient(43.82deg, #cac7e4 0%, #ab8eec 28.4%, #dd837a 65.1%, #ecd0cd 100%)'
            },
            keyframes: {
                slideLeft: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-100%)' }
                }
            },
            animation: {
                'slide-left': 'slideLeft 40s linear infinite'
            }
        },
        daisyui: {
            themes: [
                {
                    gradient: {
                        // eslint-disable-next-line @typescript-eslint/no-var-requires
                        ...require('daisyui/src/theming/themes')['dark'],
                        primary: '#5F2BCE'
                    }
                }
            ]
        }
    },
    variants: {},
    plugins: [require('@tailwindcss/forms'), require('daisyui')]
};
