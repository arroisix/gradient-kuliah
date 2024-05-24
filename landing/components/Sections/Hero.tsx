import Container from './Container';
import Image from 'next/image';
import { CDN_URL } from 'commons/constants';
import { cn } from 'commons/utils';
import Link from 'next/link';
import { useAuth } from 'authentication/contexts/AuthProvider';

const Hero = () => {
    const { isAuthenticated } = useAuth()

    return (
        <section className='bg-[#222222] md:bg-[#101010]' id='hero'>
            <Container className='flex flex-col-reverse md:flex-row items-center py-7 lg:py-16 pt-20 md:pt-24 lg:pt-24 gap-6 md:gap-12 lg:gap-16'>
                <div className='flex flex-col justify-center w-full md:w-[80%] lg:w-1/2 gap-4 md:gap-5'>
                    <h1 className='font-sans text-2xl lg:text-4xl font-extrabold whitespace-pre-line'>
                        {isAuthenticated? 
                            'Langganan Untuk Mengakses Seluruh Materi' : 
                            (<> Aplikasi <span className='text-[#7264EB]'>Belajar Kuliah</span> Terlengkap di Indonesia</>)
                        }
                    </h1>
                    <p className='font-body text-[#CCCCCC] text-justify text-sm lg:text-lg'>
                        Dapatkan akses ke video kelas, pembahasan soal, textbook, dan rangkuman untuk membantu kamu meraih IPK idaman
                    </p>
                    <div className={cn('mt-2 md:mt-3 lg:mt-7 flex', isAuthenticated? 'flex-col gap-4' : 'flex-row gap-4')}>
                        <Link href={isAuthenticated? '/langganan' : '/daftar'} className='bg-accent-purple rounded-full text-white font-body py-2.5 px-12 text-sm lg:text-base w-full text-center w-full'>
                            {isAuthenticated? 'Langganan' : 'Daftar'}
                        </Link>
                        <Link href={isAuthenticated? 'https://wa.me/0812123456' : '#hero'} className='bg-neutral-700 rounded-full text-white py-2.5 px-12 text-sm lg:text-base text-center w-full'>
                            {isAuthenticated? 'Belum Yakin? Tanya ke Admin!' : 'Telusuri'}
                        </Link>
                    </div>
                </div>
                <div className="relative w-full lg:w-1/2 aspect-[625/372]">
                    <Image
                        src={`${CDN_URL}/assets/landing-page-unauthenticated-hero.png`}
                        priority
                        layout="fill"
                        alt='hero-image'
                    />
                </div>
            </Container>
        </section>
    )
}

export default Hero;