/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
    getIsProfileComplete,
    getToken
} from 'authentication/redux/selectors/userSelector';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { getDisplayName, sanitizeUrl } from './utils';
import { useGetPacketOfferQuery } from 'payment/redux/api/subscriptionApi';
import { sendGTMEvent } from '@next/third-parties/google';
import { useLocalStorage } from 'usehooks-ts';
import { useAuth } from 'authentication/contexts/AuthProvider';
import LoadingBackdrop from './components/elements/LoadingBackdrop';

const withAnon = <P extends object>(
    WrappedComponent: React.ComponentType<P>
) => {
    const WithAnon = (
        props: JSX.IntrinsicAttributes & { children?: ReactNode }
    ) => {
        // checks whether we are on client / browser or server.
        if (typeof window !== 'undefined') {
            const accessToken = useSelector(getToken);
            const isProfileComplete = useSelector(getIsProfileComplete);
            const {
                is_subscribed,
                everSubscribed,
                isLoading: isLoadingSubscribed
            } = useCourseSubscription();
            const { profile } = useAuth();
            const { data: pricingData, isLoading: isLoadingPricing } =
                useGetPacketOfferQuery();
            const router = useRouter();

            const [showAccountTypePrompt] = useLocalStorage(
                'showAccountTypePrompt',
                false
            );

            const redirectToFirstPage = () => {
                if (profile?.current_role === 'K12') {
                    router.replace('/latihan');
                } else {
                    router.replace('/dashboard');
                }
            };

            if (!!accessToken) {
                if (!isLoadingSubscribed && !isLoadingPricing) {
                    if (
                        router.pathname !== '/onboarding/jenis-akun' &&
                        showAccountTypePrompt
                    ) {
                        router.push({
                            pathname: '/onboarding/jenis-akun',
                            query: router.query
                        });
                        return;
                    }

                    if (['/masuk', '/daftar'].includes(router.pathname)) {
                        if (!isProfileComplete) {
                            router.replace(
                                `/onboarding${
                                    !!router.query.redirect
                                        ? `?redirect=${sanitizeUrl(
                                              router.query.redirect as string
                                          )}`
                                        : ''
                                }`
                            );
                        } else if (!!router.query.redirect) {
                            router.replace(
                                `${sanitizeUrl(
                                    router.query.redirect as string
                                )}`
                            );
                        } else {
                            if (is_subscribed) {
                                if (!profile) {
                                    return <LoadingBackdrop />;
                                }
                                redirectToFirstPage();
                            } else {
                                const packetId =
                                    localStorage.getItem('packetId');
                                if (packetId) {
                                    const pricing = pricingData?.data.find(
                                        (p) => p.id == packetId
                                    );
                                    if (pricing) {
                                        sendGTMEvent({
                                            event: 'add_package',
                                            ecommerce: {
                                                currency: 'IDR',
                                                value: pricing.price,
                                                items: [
                                                    {
                                                        item_id:
                                                            pricing.packet_name,
                                                        price: pricing.price
                                                    }
                                                ]
                                            }
                                        });
                                    }
                                    router.replace(
                                        `/pembayaran?packetId=${packetId}`
                                    );
                                } else {
                                    if (everSubscribed) {
                                        if (!profile) {
                                            return <LoadingBackdrop />;
                                        }
                                        redirectToFirstPage();
                                    } else if (!!router.query.redirect) {
                                        router.replace(
                                            `${sanitizeUrl(
                                                router.query.redirect as string
                                            )}`
                                        );
                                    } else {
                                        router.replace('/');
                                    }
                                }
                            }
                        }
                    } else if (
                        ['/', '/landing-revamp'].includes(router.pathname)
                    ) {
                        if (!profile) {
                            return <LoadingBackdrop />;
                        }
                        redirectToFirstPage();
                    }

                    return <WrappedComponent {...(props as P)} />;
                }
                return <WrappedComponent {...(props as P)} />;
            }
            return <WrappedComponent {...(props as P)} />;
        }

        // If we are on server, return null
        return <WrappedComponent {...(props as P)} />;
    };
    WithAnon.displayName = getDisplayName(WrappedComponent);
    return WithAnon;
};

export default withAnon;
