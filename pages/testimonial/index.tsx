import React from 'react';
import Layout from 'commons/layout';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import TestimonialCard from '../../commons/components/elements/Testimonial/TestimonialCard';
import { useRouter } from 'next/router';
import Paginator from '../../commons/components/elements/Paginator';
import testimonialData from '../../commons/data/testimonials.json';
import { Testimonial } from '../../commons/types/testimonial';

const TestimonialPage = () => {
    const router = useRouter();
    const currentPage = parseInt((router.query.page as string) ?? '1');
    const itemsPerPage = 3;

    const testimonials = testimonialData.testimonials;
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentTestimonials = testimonials.slice(start, end);
    const totalPages = Math.ceil(testimonials.length / itemsPerPage);

    return (
        <Layout isFullBlackBackground>
            <div className="min-h-screen py-16">
                <div className="max-w-[960px] mx-auto px-4 md:px-0">
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
                                        image={testimonial.image.url}
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

export default TestimonialPage;
