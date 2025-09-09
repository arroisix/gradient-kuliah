import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import useOnScreen from 'commons/hooks/useOnScreen';
import { cn, sanitizeUrl } from 'commons/utils';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';

const StartReadingButton = ({
    first_problem_id
}: Pick<BookDetailInterface, 'first_problem_id'>): JSX.Element => {
    const router = useRouter();
    const { slug } = router.query as { slug: string };
    const buttonRef = useRef<HTMLDivElement | null>(null);
    const onScreen = useOnScreen(buttonRef, '-128px 0px 0px 0px');

    const isAuthenticated = useSelector(getIsAuthenticated);
    const getLink = (): string => {
        if (!first_problem_id) return '?';
        if (!isAuthenticated)
            return `/daftar?redirect=${sanitizeUrl(router.basePath)}`;
        if (!!first_problem_id)
            return `/astronotes/textbook/${slug}/${first_problem_id}`;
        return `/astronotes/${slug}/1`;
    };

    return (
        <>
            <div ref={buttonRef} className="w-full">
                <Button
                    href={getLink()}
                    variant="primary"
                    disabled={!first_problem_id}
                    className={cn(
                        !first_problem_id && 'btn-disabled',
                        'w-full my-2 text-center md:w-max'
                    )}>
                    Mulai Membaca
                </Button>
            </div>
            <Button
                href={getLink()}
                variant="primary"
                disabled={!first_problem_id}
                className={cn(
                    'transition fixed z-10 inset-x-4 md:hidden bottom-8 text-center',
                    !first_problem_id && 'btn-disabled',
                    !onScreen
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                )}>
                Mulai Membaca
            </Button>
        </>
    );
};

export default StartReadingButton;
