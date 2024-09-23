type ProductCardProps = {
    orientation: 'vertical' | 'horizontal';
    href: string;
    category: 'video' | 'astronotes' | 'bank soal' | 'textbook' | string;
    eventName: string;
    eventPayload?: { [key: string]: unknown };
    className?: string;
    imageClassname?: string;
    heading?: 'h2' | 'h3' | 'p';
    product: Product;
};

type Product = {
    title: string;
    thumbnail: string;
    inProgress: boolean;
    latestProgress: number;
    latestChapter?: string;
    authors?: string[];
    rating?: number;
    isComingSoon?: boolean;
    isNew?: boolean;
    isFree?: boolean;
    courseName?: string;
};
