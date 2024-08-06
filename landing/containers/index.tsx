import Hero from 'landing/components/Sections/Hero';
import Features from 'landing/components/Sections/Features';
import IndonesiaMapCTA from 'landing/components/Sections/IndonesiaMapCTA';
import Pricing from 'landing/components/Sections/Pricing';
import Testimony from 'landing/components/Sections/Testimony';
import Popular from 'landing/components/Sections/Popular';
import { useState, useEffect } from 'react';
import { useGetPublicListCoursesV2Query } from 'courses/redux/api/publicCourseV2Api';
import { useGetLandingPopularBooksQuery } from 'courses/redux/api/astronotesApi';

const LandingContainer = ({
    classesData,
    popularBooksData,
    pricingData
}: LandingContainerProps): JSX.Element => {
    const { data: booksData, isFetching: isLoadingBooksData } =
        useGetLandingPopularBooksQuery({ major: 'all' });
    const { data: coursesData, isFetching: isLoadingCoursesData } =
        useGetPublicListCoursesV2Query({ major: 'all' });
    const [popularBooks, setPopularBooks] = useState<LandingPopularBook[]>(
        popularBooksData ?? []
    );
    const [classes, setClasses] = useState<Course[]>(classesData ?? []);

    useEffect(() => {
        setPopularBooks(booksData?.books ?? []);
    }, [booksData]);

    useEffect(() => {
        setClasses(coursesData?.data ?? []);
    }, [coursesData]);

    return (
        <div className="bg-black min-h-screen">
            <Hero />
            <Features title={'Pilih fitur yang sesuai sama cara belajarmu'} />
            <Popular
                type="book"
                popularBooks={popularBooks}
                isLoading={isLoadingBooksData}
            />
            <Popular
                type="course"
                classes={classes}
                isLoading={isLoadingCoursesData}
            />
            <Testimony />
            <Pricing
                pricingData={pricingData}
                ctaEventName="Pricing Button on Main Landing Page"
            />
            <IndonesiaMapCTA />
        </div>
    );
};

export default LandingContainer;
