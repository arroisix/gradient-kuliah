import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import GradientIcon from 'commons/components/GradientIcon';
import Button from 'commons/components/elements/Button';
import { AUTHENTICATION_ROUTE } from 'commons/constants';
import { queryParamBuilder } from 'commons/utils';
import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';

type CommunityBannerProps = {
    askNow?: () => void;
};

const CommunityBanner = ({ askNow }: CommunityBannerProps): JSX.Element => {
    const router = useRouter();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );
    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 w-full px-5 py-[14px] bg-[#5F2BCE] rounded-lg">
            <div className="flex items-center gap-3">
                <GradientIcon />
                <span className="inline-block text-xs font-body">
                    {isAuthenticated
                        ? 'Tidak menemukan jawaban di komunitas?'
                        : 'Daftar sekarang untuk bertanya'}
                </span>
            </div>
            <Button
                variant="custom"
                className="w-full px-6 text-xs font-extrabold bg-black md:w-fit whitespace-nowrap"
                eventName={
                    !isAuthenticated
                        ? 'Click "Buat Pertanyaan Gratis" Button'
                        : 'Click "Tanya Sekarang" Button'
                }
                eventPayload={
                    isLandingPageRevampOn ? { Variant: 'NOV 2023' } : {}
                }
                href={
                    isAuthenticated
                        ? undefined
                        : `${AUTHENTICATION_ROUTE}?${queryParamBuilder({
                              redirect: router.asPath + '?ask=true'
                          })}`
                }
                onClick={isAuthenticated ? askNow : undefined}>
                {!isAuthenticated ? 'Buat Pertanyaan Gratis' : 'Tanya Sekarang'}
            </Button>
        </div>
    );
};

export default CommunityBanner;
