import Button from 'commons/components/elements/Button';
import Container from 'commons/components/elements/Container';
import CatalogContainer from 'courses/components/CatalogContainer';
import { useGetActiveSubscriptionQuery } from 'payment/redux/api/subscriptionApi';
import { countTheDay } from 'payment/utils';
import { useState, useEffect } from 'react';

const Catalog = ({ course }: { course: Course }): JSX.Element => {
    const { data } = useGetActiveSubscriptionQuery();
    const sortChapterOrder = (): Chapter[] => {
        const rawChapters = [...course.chapters];
        const sortedChapter = rawChapters?.sort(
            (a: Chapter, b: Chapter) => a.order - b.order
        );

        return sortedChapter;
    };
    const [expiryDay, setExpiryDay] = useState(30);

    useEffect(() => {
        if (data) {
            setExpiryDay(countTheDay(data.deactivate_after as string) + 1);
        }
    }, [data]);

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
                                href={`/pembayaran?packetId=${data?.packet_id}&subscriptionId=${data?.subscription_id}`}
                                variant="custom"
                                className="bg-accent-yellow text-black w-full md:w-[250px] font-body text-center">
                                Perpanjang
                            </Button>
                        </div>
                    </div>
                )}
            <CatalogContainer
                slug={course.slug}
                chapters={sortChapterOrder()}
                latest_subchapter={course.learning_progress?.latest_watch_video}
            />
        </Container>
    );
};

export default Catalog;
