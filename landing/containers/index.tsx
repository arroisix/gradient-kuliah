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
    majorData,
    classesData,
    popularBooksData,
    pricingData
}: LandingContainerProps): JSX.Element => {
    const [selectedBookMajor, setSelectedBookMajor] = useState<string>(
        majorData?.[0].slug ?? 'all'
    );
    const [selectedCourseMajor, setSelectedCourseMajors] = useState<string>(
        majorData?.[0].slug ?? 'all'
    );
    const {
        data: booksData,
        isFetching: isLoadingBooksData,
        refetch: refetchBooksData
    } = useGetLandingPopularBooksQuery({ major: selectedBookMajor });
    const {
        data: coursesData,
        isFetching: isLoadingCoursesData,
        refetch: refetchCoursesData
    } = useGetPublicListCoursesV2Query({ major: selectedCourseMajor });
    const [popularBooks, setPopularBooks] = useState<LandingPopularBook[]>(
        popularBooksData ?? []
    );
    const [classes, setClasses] = useState<Course[]>(classesData ?? []);

    useEffect(() => {
        if (selectedBookMajor !== 'all') {
            refetchBooksData();
        }
    }, [selectedBookMajor]);

    useEffect(() => {
        setPopularBooks(booksData?.books ?? []);
    }, [booksData]);

    useEffect(() => {
        if (selectedCourseMajor !== 'all') {
            refetchCoursesData();
        }
    }, [selectedCourseMajor]);

    useEffect(() => {
        setClasses(coursesData?.data ?? []);
    }, [coursesData]);

    return (
        <div className="bg-black min-h-screen">
            <Hero />
            <Features title={'Pilih fitur yang sesuai sama cara belajarmu'} />
            <Popular
                type="book"
                majorData={majorData}
                popularBooks={popularBooks}
                setSelectedMajor={setSelectedBookMajor}
                isLoading={isLoadingBooksData}
            />
            <Popular
                type="course"
                majorData={majorData}
                classes={classes}
                setSelectedMajor={setSelectedCourseMajors}
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
