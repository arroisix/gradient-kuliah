import Button from 'commons/components/elements/Button';
import Skeleton from 'commons/components/elements/Skeleton';
import { cn } from 'commons/utils';
import { useUpdateMyClassesMutation } from 'dashboard/redux/api/dashboardApi';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useTracker } from 'tracker/tracker';
import Spinner from 'commons/components/elements/Spinner';
import EmptyState from './EmptyState';
import AccordionItem from './AccordionItem';
import ClassActionItem from './ClassActionItem';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';

const MyClassesAccordion = ({
    isLoading,
    courses
}: {
    isLoading: boolean;
    courses?: GetDashboardContentResponse['my_class'];
}): JSX.Element => {
    const [course, setCourse] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [deleting, setDeleting] = useState<string[]>([]);
    const tracker = useTracker();
    const { is_subscribed: isSubscribed } = useCourseSubscription();
    const [edit, { isLoading: isSubmitting, isSuccess }] =
        useUpdateMyClassesMutation();

    useEffect(() => {
        if (isEditing) setDeleting([]);
    }, [isEditing]);

    useEffect(() => {
        if (isSuccess) setIsEditing(false);
    }, [isSuccess]);

    const toggleAccordion = (slug: string, name: string): void => {
        if (course !== slug)
            tracker?.genericTrack('User click "Kelasku" Accordion', {
                Course: name
            });
        setCourse((prev) => (prev == slug ? '' : slug));
    };

    const submitEditClasses = (): void => {
        edit({ deleted_course_slug: deleting });
    };

    const MyClassesLayout = ({ children }: PropsWithChildren): JSX.Element => (
        <div
            className={cn(
                'space-y-4 w-full',
                isSubscribed
                    ? 'md:w-[calc(100vw-250px-4rem)] lg:w-full'
                    : 'md:w-full'
            )}>
            <div
                aria-hidden
                className={cn(
                    'fixed inset-0 bg-black/60 z-[5]',
                    !isEditing && 'hidden'
                )}
                onClick={() => setIsEditing(false)}></div>
            <div
                className={cn(
                    isEditing && 'relative z-[6]',
                    'flex justify-between'
                )}>
                <h4 className="text-lg font-extrabold md:text-xl">Kelasku</h4>
                <div className="flex gap-3">
                    <Button
                        variant="custom"
                        size="extraSmall"
                        onClick={() => setIsEditing((prev) => !prev)}
                        className={cn(
                            'text-sm text-white transition border border-white hover:bg-neutral-800',
                            !courses || (courses.length === 0 && 'hidden')
                        )}>
                        {isEditing ? 'Batal' : 'Edit'}
                    </Button>
                    <Button
                        variant="custom"
                        size="extraSmall"
                        onClick={() => submitEditClasses()}
                        disabled={isSubmitting}
                        className={cn(
                            'text-sm bg-state-success',
                            !isEditing && 'hidden'
                        )}>
                        {isSubmitting ? <Spinner size="small" /> : 'Simpan'}
                    </Button>
                </div>
            </div>
            {children}
        </div>
    );

    if (isLoading)
        return (
            <MyClassesLayout>
                <Skeleton repeat={3} className="h-12" />
            </MyClassesLayout>
        );

    if (isEditing)
        return (
            <MyClassesLayout>
                {courses?.map(({ course_slug: slug, name }) =>
                    deleting.includes(slug) ? (
                        <></>
                    ) : (
                        <ClassActionItem
                            key={slug}
                            slug={slug}
                            name={name}
                            setDeleting={setDeleting}
                        />
                    )
                )}
            </MyClassesLayout>
        );

    if (courses && courses.length == 0)
        return (
            <MyClassesLayout>
                <EmptyState />
            </MyClassesLayout>
        );

    return (
        <MyClassesLayout>
            {courses &&
                courses.map(({ course_slug: slug, name }) => (
                    <AccordionItem
                        key={slug}
                        isOpen={slug == course}
                        slug={slug}
                        name={name}
                        isEditing={isEditing}
                        toggleAccordion={toggleAccordion}
                    />
                ))}
        </MyClassesLayout>
    );
};

export default MyClassesAccordion;
