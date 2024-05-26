type LandingContainerProps = {
    pricingData?: PacketOffer[];
    majorData?: MajorOptions[];
    classesData?: Course[];
    popularBooksData?: LandingPopularBook[];
};

type LandingFeatureCardProps = {
    link: string;
    title: string;
    description: string;
    photoName: string;
    photoSize: 'sm' | 'md';
};

type LandingPricingProps = {
    pricingData?: PacketOffer[];
    ctaEventName?: string;
};

type LandingHeroCopywritingInterface = {
    title: {
        authenticated: string;
        unauthenticated: JSX.Element;
    };
    description: string;
    primaryButton: {
        authenticated: string;
        unauthenticated: string;
    };
    secondaryButton: {
        unauthenticated: string;
        authenticated: string;
    };
};

type LandingTestimonyInterface = {
    testimony: string;
    name: string;
    role: string;
    photo: string;
};

type LandingPopularProps = {
    type: 'book' | 'course';
    majorData?: MajorOptions[];
    classes?: Course[];
    popularBooks?: LandingPopularBook[];
    selectedMajor: string;
    setSelectedMajor: Dispatch<SetStateAction<string>>;
};

type LandingPopularBook = {
    id: string;
    title: string;
    slug: string;
    book_cover_url: string;
    category_name: 'Textbook' | 'Astronotes' | 'Bank Soal';
};

interface GetLandingPopularBooksResponseData {
    books: LandingPopularBook[];
}
