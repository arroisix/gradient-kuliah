import { useAuth } from 'authentication/contexts/AuthProvider';
import { useGetPrivateListCoursesV2Query } from 'courses/redux/api/privateCourseV2Api';
import { useGetPublicListCoursesV2Query } from 'courses/redux/api/publicCourseV2Api';
import { CourseMenuItem } from './CourseMenuItem';
import { useMemo, useState } from 'react';
import { NavigationMenu } from '@base-ui/react/navigation-menu';
import { useRouter } from 'next/router';
import { FaChevronDown } from 'react-icons/fa';
import { ArrowSvg } from 'commons/components/modules/Navbar/components/utbk/Arrows';
import Modal from 'commons/components/modules/Modal';
import { XIcon } from 'lucide-react';

function MateriLearnNavigation(): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    const router = useRouter();
    const { slug_subtest } = router.query as { slug_subtest: string };

    const { isLoading: isPublicCoursesLoading, data: publicCourses } =
        useGetPublicListCoursesV2Query(
            { type: 'UTBK' },
            { skip: isAuthenticated }
        );

    const { isLoading: isPrivateCoursesLoading, data: privateCourses } =
        useGetPrivateListCoursesV2Query({}, { skip: !isAuthenticated });

    const courses = useMemo(() => {
        return publicCourses
            ? publicCourses.data
            : privateCourses
            ? privateCourses.data
            : [];
    }, [privateCourses, publicCourses]);

    const currentCourse = useMemo(
        () => courses.find((course) => course.slug === slug_subtest),
        [courses, slug_subtest]
    );

    return (
        <>
            {/* desktop navigation */}
            <NavigationMenu.Root className="hidden lg:block">
                <NavigationMenu.List className="list-none">
                    <NavigationMenu.Item>
                        <NavigationMenu.Trigger
                            className={`${
                                isPrivateCoursesLoading ||
                                isPublicCoursesLoading ||
                                !currentCourse
                                    ? 'pointer-events-none'
                                    : ''
                            } text-white font-bold flex items-center gap-2.5 text-2xl`}>
                            {currentCourse ? (
                                currentCourse.course_name
                            ) : (
                                <div className="animate-pulse bg-[#333333] h-5 w-48 rounded-md"></div>
                            )}

                            <NavigationMenu.Icon className="data-[popup-open]:-rotate-180 transition-all duration-300">
                                <FaChevronDown className="text-white w-4 h-4 group-open:-rotate-180 transition-all duration-300" />
                            </NavigationMenu.Icon>
                        </NavigationMenu.Trigger>

                        <NavigationMenu.Content className="transition-[opacity,transform,translate] duration-[var(--duration)] ease-[var(--easing)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 data-[starting-style]:data-[activation-direction=left]:translate-x-[-50%] data-[starting-style]:data-[activation-direction=right]:translate-x-[50%] data-[ending-style]:data-[activation-direction=left]:translate-x-[50%] data-[ending-style]:data-[activation-direction=right]:translate-x-[-50%]">
                            <ul className="bg-black grid grid-cols-2 gap-x-8 gap-y-6 w-screen max-w-[896px] rounded-2xl p-6">
                                {courses.map((course) => (
                                    <CourseMenuItem
                                        key={course.id}
                                        course={course}
                                        href={`/utbk/materi/${course.slug}/${course.latest_chapter_slug}/${course.latest_subchapter_slug}`}
                                    />
                                ))}
                            </ul>
                        </NavigationMenu.Content>
                    </NavigationMenu.Item>
                </NavigationMenu.List>

                <NavigationMenu.Portal>
                    <NavigationMenu.Positioner
                        sideOffset={32}
                        collisionPadding={{
                            top: 5,
                            bottom: 5,
                            left: 20,
                            right: 20
                        }}
                        collisionAvoidance={{ side: 'none' }}
                        className="box-border h-[var(--positioner-height)] w-[var(--positioner-width)] max-w-[var(--available-width)] transition-[top,left,right,bottom] duration-[var(--duration)] ease-[var(--easing)] before:absolute before:content-[''] data-[instant]:transition-none data-[side=bottom]:before:top-[-10px] data-[side=bottom]:before:right-0 data-[side=bottom]:before:left-0 data-[side=bottom]:before:h-2.5 data-[side=left]:before:top-0 data-[side=left]:before:right-[-10px] data-[side=left]:before:bottom-0 data-[side=left]:before:w-2.5 data-[side=right]:before:top-0 data-[side=right]:before:bottom-0 data-[side=right]:before:left-[-10px] data-[side=right]:before:w-2.5 data-[side=top]:before:right-0 data-[side=top]:before:bottom-[-10px] data-[side=top]:before:left-0 data-[side=top]:before:h-2.5"
                        style={{
                            ['--duration' as string]: '0.35s',
                            ['--easing' as string]:
                                'cubic-bezier(0.22, 1, 0.36, 1)'
                        }}>
                        <NavigationMenu.Popup className="data-[ending-style]:easing-[ease] relative h-[var(--popup-height)] origin-[var(--transform-origin)] transition-[opacity,transform,width,height,scale,translate] duration-[var(--duration)] ease-[var(--easing)] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[ending-style]:duration-150 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 w-[var(--popup-width)] xs:w-[var(--popup-width)]">
                            <NavigationMenu.Arrow
                                className="flex transition-[left] duration-[var(--duration)] ease-[var(--easing)] data-[side=bottom]:top-0 data-[side=left]:right-[-13px] data-[side=left]:rotate-90 data-[side=right]:left-[-13px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180"
                                style={{ transform: 'translateY(-100%)' }}>
                                <ArrowSvg />
                            </NavigationMenu.Arrow>
                            <NavigationMenu.Viewport className="relative h-full w-full overflow-hidden" />
                        </NavigationMenu.Popup>
                    </NavigationMenu.Positioner>
                </NavigationMenu.Portal>
            </NavigationMenu.Root>

            {/* mobile navigation */}
            <button
                onClick={() => setIsOpen(true)}
                type="button"
                className={`${
                    isPrivateCoursesLoading ||
                    isPublicCoursesLoading ||
                    !currentCourse
                        ? 'pointer-events-none'
                        : ''
                } text-white font-bold text-base flex items-center gap-2.5 lg:hidden`}>
                {currentCourse ? (
                    currentCourse.course_name
                ) : (
                    <div className="animate-pulse bg-[#333333] h-4 w-48 rounded-md"></div>
                )}
                <FaChevronDown className="text-white w-3.5 h-3.5 group-open:-rotate-180 transition-all duration-300" />
            </button>

            {isOpen ? (
                <Modal
                    isOpen={isOpen}
                    setOpen={(value) => setIsOpen(value)}
                    permanent={true}
                    variant="dark"
                    containerClassName="modal modal-open modal-bottom lg:modal-middle min-h-[100px]"
                    className="bg-[#101010] h-screen p-0">
                    <div className="bg-[#101010] py-6 px-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-white font-semibold">
                                Ganti Materi
                            </h2>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}>
                                <XIcon className="text-[#4D5165] w-6 h-6" />
                            </button>
                        </div>

                        <ul className="p-0 space-y-2">
                            {courses.map((course) => (
                                <CourseMenuItem
                                    key={course.id}
                                    course={course}
                                    href={`/utbk/materi/${course.slug}/${course.latest_chapter_slug}/${course.latest_subchapter_slug}`}
                                />
                            ))}
                        </ul>
                    </div>
                </Modal>
            ) : (
                <></>
            )}
        </>
    );
}

export { MateriLearnNavigation };
