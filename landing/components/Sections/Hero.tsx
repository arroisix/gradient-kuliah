import Container from './Container';
import Image from 'next/image';
import { CDN_URL } from 'commons/constants';
import { cn, onlyText } from 'commons/utils';
import Link from 'next/link';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { useTracker } from 'tracker/tracker';
import { COPYWRITING } from 'landing/constants/Hero';

const Hero = (): JSX.Element => {
    const { isAuthenticated } = useAuth();
    const tracker = useTracker();

    const handleClick = (buttonText: string) => {
        tracker?.trackButtonClick(
            `Click ${buttonText} Button`,
            onlyText(buttonText),
            { 'Section Name': 'Hero' }
        );
    };

    return (
        <div className="bg-[#222222] md:bg-[#101010]" id="hero">
            <Container
                className="flex flex-col-reverse md:flex-row items-center py-7 lg:py-16 pt-20 md:pt-24 lg:pt-24 gap-6 md:gap-12 lg:gap-16"
                id="hero">
                <div className="flex flex-col justify-center w-full md:w-[80%] lg:w-1/2 gap-4 md:gap-5">
                    <h1 className="font-sans text-2xl lg:text-4xl font-extrabold whitespace-pre-line">
                        {isAuthenticated
                            ? COPYWRITING.title.authenticated
                            : COPYWRITING.title.unauthenticated}
                    </h1>
                    <p className="font-body text-[#CCCCCC] text-justify text-sm lg:text-lg">
                        {COPYWRITING.description}
                    </p>
                    <div
                        className={cn(
                            'mt-2 md:mt-3 lg:mt-7 flex',
                            isAuthenticated
                                ? 'flex-col gap-4'
                                : 'flex-row gap-4'
                        )}>
                        <Link
                            href={
                                isAuthenticated
                                    ? '/langganan'
                                    : '/daftar?redirect=/langganan'
                            }
                            className="bg-accent-purple rounded-full text-white font-body font-bold py-2.5 px-12 text-sm lg:text-base text-center w-full"
                            onClick={() =>
                                handleClick(
                                    isAuthenticated
                                        ? COPYWRITING.primaryButton
                                              .authenticated
                                        : COPYWRITING.primaryButton
                                              .unauthenticated
                                )
                            }>
                            {isAuthenticated
                                ? COPYWRITING.primaryButton.authenticated
                                : COPYWRITING.primaryButton.unauthenticated}
                        </Link>
                        <Link
                            href={
                                isAuthenticated
                                    ? 'https://wa.me/+6285179893859'
                                    : '#features'
                            }
                            className="bg-neutral-700 rounded-full text-white font-bold py-2.5 px-12 text-sm lg:text-base text-center w-full"
                            onClick={() =>
                                handleClick(
                                    isAuthenticated
                                        ? COPYWRITING.secondaryButton
                                              .authenticated
                                        : COPYWRITING.secondaryButton
                                              .unauthenticated
                                )
                            }>
                            {isAuthenticated
                                ? COPYWRITING.secondaryButton.authenticated
                                : COPYWRITING.secondaryButton.unauthenticated}
                        </Link>
                    </div>
                </div>
                <div
                    className={cn(
                        'relative w-full',
                        isAuthenticated
                            ? 'aspect-[710/325] bg-[#33354080]/[0.5] rounded-3xl overflow-hidden lg:w-3/5'
                            : 'aspect-[1250/744] lg:w-1/2'
                    )}>
                    <Image
                        src={`${CDN_URL}/assets/landing-hero-revamp-unregistered.png`}
                        priority
                        layout="fill"
                        className="object-cover"
                        alt="hero"
                    />
                </div>
            </Container>
        </div>
    );
};

export default Hero;
