import Hero from 'landing/components/Sections/Hero';
import Features from 'landing/components/Sections/Features';
import IndonesiaMapCTA from 'landing/components/Sections/IndonesiaMapCTA';
import Pricing from 'landing/components/Sections/Pricing';
import Testimony from 'landing/components/Sections/Testimony';
import Popular from 'landing/components/Sections/Popular';
import { useState } from 'react';
// import { useRouter } from 'next/router';

const LandingContainer = ({
    majorData,
    classesData,
    popularBooksData,
    pricingData
}: LandingContainerProps): JSX.Element => {
    // const router = useRouter();
    // const { 'book-major': bookMajor, 'class-major': classMajor } =
    //     router.query as { 'book-major'?: string; 'class-major'?: string };
    const [selectedBookMajor, setSelectedBookMajor] = useState<string>(
        majorData?.[0].slug ?? ''
    );
    const [selectedCourseMajor, setSelectedCourseMajors] = useState<string>(
        majorData?.[0].slug ?? ''
    );
    const [classes, _setClasses] = useState<Course[]>(classesData ?? []);
    const [popularBooks, _setPopularBooks] = useState<LandingPopularBook[]>(
        popularBooksData ?? []
    );

    // useEffect(() => {
    //     router.replace({
    //         pathname: '/#books-recommendation',
    //         query: { 'book-major': selectedBookMajor, 'class-major': selectedCourseMajor }
    //     })
    // }, [selectedBookMajor])

    // useEffect(() => {
    //     router.replace({
    //         pathname: '/#courses-recommendation',
    //         query: { 'book-major': selectedBookMajor, 'class-major': selectedCourseMajor }
    //     })
    // }, [selectedCourseMajor])

    return (
        <div className="bg-black min-h-screen">
            <Hero />
            <Features />
            <Popular
                type="book"
                majorData={majorData}
                popularBooks={popularBooks}
                selectedMajor={selectedBookMajor}
                setSelectedMajor={setSelectedBookMajor}
            />
            <Popular
                type="course"
                majorData={majorData}
                classes={classes}
                selectedMajor={selectedCourseMajor}
                setSelectedMajor={setSelectedCourseMajors}
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
