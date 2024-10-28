import { GetStaticProps } from 'next';
import React from 'react';
import Layout from 'commons/layout';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import TestimonialCard from '../../commons/components/elements/Testimonial/TestimonialCard';
import { useRouter } from 'next/router';
import Paginator from '../../commons/components/elements/Paginator';
import testimonialData from '../../commons/data/testimonials.json';
import { Testimonial } from '../../commons/types/testimonial';
import { CDN_URL } from '../../commons/constants';

const PAGE_SIZE = 3;

interface TestimonialPageProps {
    testimonials: Testimonial[];
}

const TestimonialPage = ({
    testimonials
}: TestimonialPageProps): JSX.Element => {
    const router = useRouter();
    const { page } = router.query as { page: string };
    const currentPage = parseInt(page ?? '1');

    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const currentTestimonials = testimonials.slice(start, end);
    const totalPages = Math.ceil(testimonials.length / PAGE_SIZE);

    return (
        <Layout isFullBlackBackground>
            <div className="min-h-screen py-16">
                <div className="max-w-[960px] mx-auto px-4 md:px-4 lg:px-0">
                    <Breadcrumb className="py-4" />
                    <div className="flex flex-col gap-8 pt-2">
                        <div className="text-center gap-2">
                            <h1 className="text-base md:text-base font-base">
                                Testimonial
                            </h1>
                            <h2 className="text-2xl font-bold md:text-2xl">
                                <span className="text-[#7264EB]">
                                    Kata mereka
                                </span>{' '}
                                yang belajar bersama Gradient
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {currentTestimonials.map(
                                (testimonial: Testimonial) => (
                                    <TestimonialCard
                                        key={testimonial.id}
                                        name={testimonial.name}
                                        university={testimonial.university}
                                        text={testimonial.text}
                                        image={`${CDN_URL}/assets/testimonials/${testimonial.image.url}`}
                                    />
                                )
                            )}
                        </div>

                        <Paginator
                            totalPages={totalPages}
                            hasNextPage={currentPage < totalPages}
                            hasPreviousPage={currentPage > 1}
                            className="justify-center w-full"
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = () => {
    const META_TITLE = 'Testimonial Mahasiswa Pengguna Gradient | Gradient';
    const META_DESCRIPTION =
        'Lihat apa kata mahasiswa yang telah menggunakan Gradient sebagai platform belajar online mereka. Bergabung dengan ribuan mahasiswa lainnya untuk meningkatkan prestasi akademik Anda.';

    return {
        props: {
            testimonials: testimonialData.testimonials,
            canonical: 'https://gradient.academy/testimonial',
            title: META_TITLE,
            description: META_DESCRIPTION,
            openGraph: {
                type: 'website',
                title: META_TITLE,
                description: META_DESCRIPTION,
                url: 'https://gradient.academy/testimonial',
                images: [
                    {
                        url: 'https://assets.gradient.academy/assets/gradient-G-icon.png',
                        width: 48,
                        height: 48,
                        alt: 'Gradient Academy'
                    }
                ]
            }
        }
    };
};

export default TestimonialPage;
