import { useFeatureIsOn } from '@growthbook/growthbook-react';
import Paywall from 'commons/components/elements/Paywall';
import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useRouter } from 'next/router';
import { useGetPacketOfferQuery } from 'payment/redux/api/subscriptionApi';
import React from 'react';
import AnswerCard from './AnswerCard';
import { useKomunitas } from 'komunitas/contexts/KomunitasProvider';

type CommunityPaywallProps = {
    topComment?: CommunityPostCommentDetail;
    category?: {
        id: string;
        name: string;
    };
};

const CommunityPaywall = ({
    topComment,
    category
}: CommunityPaywallProps): JSX.Element => {
    const router = useRouter();
    const { is_subscribed } = useCourseSubscription();
    const { detailQuestion } = useKomunitas();
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );
    const { data } = useGetPacketOfferQuery();

    return isLandingPageRevampOn && !is_subscribed ? (
        <div className="relative">
            {topComment && (
                <>
                    <div className="absolute z-0 w-full select-none">
                        <AnswerCard
                            {...topComment}
                            category={category?.id as string}
                            isExpert={
                                detailQuestion?.student.username !==
                                    topComment.student.username &&
                                topComment.student.is_expert
                            }
                            questionId={detailQuestion?.id as string}
                        />
                    </div>
                    <div className="absolute top-10 h-20 w-full bg-gradient-to-b from-transparent via-black to-black z-[1]"></div>
                </>
            )}
            <div
                className={cn(
                    'flex flex-col items-center justify-center w-screen -mx-4 sm:w-auto sm:mx-0 relative z-[1] bg-black',
                    topComment && 'mt-28'
                )}>
                <h2 className="mb-4 text-xl font-extrabold leading-relaxed text-center">
                    Beli untuk melihat jawaban
                </h2>
                <Paywall
                    pricingData={data?.data}
                    isCarousel
                    redirect={router.asPath}
                    className="w-screen sm:w-full"
                    highlightedClassName="!order-none"
                    pricingClassName="max-w-[18rem] sm:max-w-xs lg:max-w-sm"
                    ctaEventName="Click Pricing Button on Community"
                />
                <span className="absolute inset-0 pointer-events-none before:hidden after:hidden lg:before:block lg:after:block before:absolute after:absolute before:z-[2] after:z-[2] before:w-8 after:w-8 before:inset-y-0 after:inset-y-0 before:pointer-events-none after:pointer-events-none before:bg-[linear-gradient(to_right,rgba(0,0,0,0.5),rgba(0,0,0,0))] before:left-0 after:bg-[linear-gradient(to_left,rgba(0,0,0,0.5),rgba(0,0,0,0))] after:right-0"></span>
            </div>
        </div>
    ) : (
        <></>
    );
};

export default CommunityPaywall;
