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
        './flashcard/**/*.{ts,js,jsx,tsx}',
        './exercises/**/*.{ts,js,jsx,tsx}',
        './live-class/**/*.{ts,js,jsx,tsx}'
    ],
    darkMode: 'class',
    theme: {
        fontFamily: {
            sans: ['Inter', 'sans-serif'],
            inter: ['Inter', 'sans-serif'],
            body: ['Inter', 'sans-serif'],
            serif: ['Inter', 'sans-serif'],
            mono: ['Inter', 'sans-serif']
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
                    green: '#34C759',
                    red: '#EF7F73'
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
                violet: {
                    1: '#191920',
                    2: '#20222E',
                    3: '#2C2E3E',
                    4: '#4B4E5F'
                },
                state: {
                    success: '#03AC5C',
                    error: '#DB4A3B'
                },
                primary: {
                    blue: '#0266D3'
                },
                purple: {
                    5: '#494BA0',
                    6: '#505A96',
                    7: '#7D89CC'
                }
            },
            backgroundImage: {
                'gradient-purple':
                    'radial-gradient(60% 60% at 50% 50%, rgba(100, 75, 169, 0.53) 0%, #030317 100%)',
                'gradient-purple-thin':
                    'radial-gradient(60% 60% at 50% 50%, rgba(95, 43, 206, 0.5) 0%, rgba(0, 0, 0, 0) 70%)',
                'gradient-purple-pricing':
                    'radial-gradient(146.27% 146.27% at 50% 50%, rgba(95, 43, 206, 0.3) 0%, rgba(0, 0, 0, 0) 100%)',
                'gradient-green-pricing':
                    'radial-gradient(146.27% 146.27% at 50% 50%, rgba(30, 104, 68, 1) 0%, rgba(0, 0, 0, 0) 100%)',
                'gradient-highlighted-price':
                    'linear-gradient(43.82deg, #cac7e4 0%, #ab8eec 28.4%, #dd837a 65.1%, #ecd0cd 100%)'
            },
            keyframes: {
                slideLeft: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-100%)' }
                },
                slideRight: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(100%)' }
                },
                slideUp: {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' }
                },
                wave: {
                    '0%, 100%': { height: '5px' },
                    '50%': { height: '15px' }
                }
            },
            animation: {
                'slide-left': 'slideLeft 40s linear infinite',
                'slide-right': 'slideRight 40s linear infinite',
                'slide-up': 'slideUp 0.3s ease-out',
                wave: 'wave 0.8s ease-in-out infinite'
            },
            height: {
                dvh: ['100vh /* fallback for Opera, IE and etc. */', '100dvh']
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
    plugins: [
        require('tailwindcss-animated'),
        require('tailwind-scrollbar'),
        require('@tailwindcss/forms'),
        require('daisyui'),
        require('@tailwindcss/container-queries')
    ]
};
