import Button from 'commons/components/elements/Button';
import Container from 'commons/components/elements/Container';
import CatalogContainer from 'courses/components/CatalogContainer';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetLandingCourseListContentQuery } from 'courses/redux/api/publicCourseApi';

const CatalogSection = ({
    slug,
    id
}: {
    slug: string;
    id: string;
}): JSX.Element => {
    const { data: content, isLoading } =
        useGetLandingCourseListContentQuery(slug);
    const { expiryDay, latest_subchapter, subscription_id } =
        useCourseSubscription(slug);
    const sortChapterOrder = (chapters: Chapter[]): Chapter[] => {
        const rawChapters = [...chapters];
        const sortedChapter = rawChapters?.sort(
            (a: Chapter, b: Chapter) => a.order - b.order
        );

        return sortedChapter;
    };

    return (
        <Container>
            {(expiryDay <= 7 || new Date() <= new Date('2022-10-14')) &&
                expiryDay < 30 && (
                    <div className="w-full flex items-center justify-center my-16">
                        <div className="border rounded-lg border-accent-yellow p-4 flex flex-col md:flex-row items-center justify-center gap-2">
                            <span>
                                Waktu berlanggangan Anda akan segera habis dalam{' '}
                                {expiryDay} hari. Perpanjang langganan untuk
                                terus mengakses layanan Gradient.
                            </span>
                            <Button
                                href={`/langganan?courseId=${id}&subscriptionId=${subscription_id}`}
                                variant="custom"
                                className="bg-accent-yellow text-black w-full md:w-[250px] font-body text-center">
                                Perpanjang
                            </Button>
                        </div>
                    </div>
                )}
            {!isLoading && content?.data ? (
                <CatalogContainer
                    chapters={sortChapterOrder(content.data)}
                    latest_subchapter={latest_subchapter}
                />
            ) : (
                <div className="flex flex-col gap-2">
                    <div className="my-2">
                        <div className="p-4 h-8 w-32 bg-neutral-600 animate-pulse rounded-lg" />
                        <div className="grid grid-cols-2 gap-2 my-8">
                            <div className="p-4 h-52 w-full bg-neutral-600 animate-pulse rounded-lg" />
                            <div className="p-4 h-52 w-full bg-neutral-600 animate-pulse rounded-lg" />
                        </div>
                    </div>
                    <div className="my-2">
                        <div className="p-4 h-8 w-32 bg-neutral-600 animate-pulse rounded-lg" />
                        <div className="grid grid-cols-2 gap-2 my-8">
                            <div className="p-4 h-52 w-full bg-neutral-600 animate-pulse rounded-lg" />
                            <div className="p-4 h-52 w-full bg-neutral-600 animate-pulse rounded-lg" />
                        </div>
                    </div>
                    <div className="my-2">
                        <div className="p-4 h-8 w-32 bg-neutral-600 animate-pulse rounded-lg" />
                        <div className="grid grid-cols-2 gap-2 my-8">
                            <div className="p-4 h-52 w-full bg-neutral-600 animate-pulse rounded-lg" />
                            <div className="p-4 h-52 w-full bg-neutral-600 animate-pulse rounded-lg" />
                        </div>
                    </div>
                    <div className="my-2">
                        <div className="p-4 h-8 w-32 bg-neutral-600 animate-pulse rounded-lg" />
                        <div className="grid grid-cols-2 gap-2 my-8">
                            <div className="p-4 h-52 w-full bg-neutral-600 animate-pulse rounded-lg" />
                            <div className="p-4 h-52 w-full bg-neutral-600 animate-pulse rounded-lg" />
                        </div>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default CatalogSection;
