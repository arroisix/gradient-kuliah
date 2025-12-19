import { CDN_URL } from 'commons/constants';
import Layout from 'commons/utbkLayout';
import Testimony from 'landing/components/Sections/Testimony';
import React from 'react';

function Hero(): JSX.Element {
    return (
        <section className="max-h-[832px] min-h-[775px] w-full aspect-[20/13] relative flex justify-center">
            <picture className="absolute">
                <source
                    srcSet={`${CDN_URL}/assets/utbk/hero.avif`}
                    type="image/avif"
                    media="(min-width: 861px)"
                    className="max-h-[832px] min-h-[775px] object-cover"
                />
                <source
                    srcSet={`${CDN_URL}/assets/utbk/hero-tablet2.avif`}
                    type="image/avif"
                    media="(min-width: 376px)"
                    className="max-h-[832px] min-h-[775px] object-cover"
                />
                <source
                    srcSet={`${CDN_URL}/assets/utbk/hero-mobile.avif`}
                    type="image/avif"
                    className="max-h-[832px] min-h-[775px] object-cover"
                />
                <img
                    src={`${CDN_URL}/assets/utbk/hero.avif`}
                    alt=""
                    className="max-h-[832px] min-h-[775px] object-cover"
                />
            </picture>
        </section>
    );
}

export default function UTBK(): JSX.Element {
    return (
        <Layout>
            <div className="flex flex-col">
                <Hero />
                <Testimony />
            </div>
        </Layout>
    );
}
