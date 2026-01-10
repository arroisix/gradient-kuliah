import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { NavigationMenu } from '@base-ui/react/navigation-menu';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { CDN_URL } from 'commons/constants';
import Button from 'commons/components/elements/Button';
import { ArrowSvg } from './components/utbk/Arrows';
import MobileSidebar from './components/utbk/MobileSidebar';
import NavigationMenuItem from './components/utbk/NavigationMenuItem';
import UTBKLogo from './components/utbk/UTBKLogo';
import { CourseMenuItem } from 'courses/components/utbk/CourseMenuItem';

function UTBKNavbar({ courses }: { courses: Course[] }): JSX.Element {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const router = useRouter();

    return (
        <header className="flex fixed top-0 z-50 w-full justify-center lg:mt-[10px]">
            <div
                className="flex justify-between items-center w-full px-8 bg-white bg-opacity-[3%] md:bg-[#040404] md:bg-opacity-[23%] border-solid border-[1px] border-white border-opacity-[8%] rounded-full h-[60px] m-4 max-w-[1232px]"
                style={{
                    boxShadow: '0px 25px 50px -12px rgba(88, 28, 135, 0.1)',
                    backdropFilter: 'blur(8px)'
                }}>
                <Link
                    href="/utbk"
                    className="text-2xl leading-6 tracking-[0.08px] font-bold font-[Urbanist] text-[#E9E9E9] flex items-center gap-2">
                    Gradient
                    <UTBKLogo />
                </Link>

                <NavigationMenu.Root className="hidden lg:block absolute left-1/2 -translate-x-1/2 transform">
                    <NavigationMenu.List className="relative flex items-center gap-8 list-none p-0">
                        <NavigationMenuItem label="Materi">
                            <div
                                className="w-screen max-w-[889px] flex-auto overflow-hidden rounded-2xl bg-black bg-opacity-90"
                                style={{
                                    backdropFilter: 'blur(32px)'
                                }}>
                                <ul className="p-6 grid grid-cols-2 gap-x-8 gap-y-6 m-0 list-none">
                                    {courses.map((course) => (
                                        <CourseMenuItem
                                            key={course.id}
                                            course={course}
                                            href={`/utbk/materi/${course.slug}/${course.latest_chapter_slug}/${course.latest_subchapter_slug}`}
                                        />
                                    ))}
                                    <li className="flex items-center text-[#B6A6F3]">
                                        <Link
                                            className="font-semibold text-sm flex gap-1 items-center ml-auto"
                                            href="/utbk/materi">
                                            Lihat Semua
                                            <FaArrowRight size={16} />
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </NavigationMenuItem>

                        <NavigationMenuItem
                            isActive={router.pathname.includes('/utbk/try-out')}
                            label="Try Out">
                            <div
                                className="w-screen max-w-[618px] flex-auto overflow-hidden rounded-2xl bg-black bg-opacity-90"
                                style={{
                                    backdropFilter: 'blur(32px)'
                                }}>
                                <div className="p-6 gap-10 flex">
                                    <section className="flex flex-col gap-4">
                                        <h4 className="text-xs leading-[125%] uppercase tracking-[2px] font-bold text-white px-3">
                                            Gratis
                                        </h4>
                                        <Link
                                            href="/utbk/try-out?access_type=free"
                                            className="flex flex-col gap-1 p-3">
                                            <h5 className="text-white text-base leading-[140%] font-semibold">
                                                Try Out Gratis
                                            </h5>
                                            <p className="text-[#999999] text-sm leading-[160%] whitespace-nowrap">
                                                Coba format dan alur try out
                                                UTBK.
                                            </p>
                                        </Link>
                                        <div className="flex h-full items-end">
                                            <Link
                                                href="/utbk/try-out"
                                                className="mb-5 text-sm leading-[125%] text-[#B6A6F3] font-semibold flex items-center gap-1 px-3">
                                                Lihat Semua
                                                <FaArrowRight size={16} />
                                            </Link>
                                        </div>
                                    </section>
                                    <section className="flex flex-col gap-4">
                                        <h4
                                            className="text-xs leading-[125%] uppercase tracking-[2px] font-bold text-white px-3"
                                            style={{
                                                background:
                                                    'linear-gradient(97.13deg, #D790DE 8.82%, #99B8DA 45.79%, #439CFB 91.57%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor:
                                                    'transparent',
                                                backgroundClip: 'text'
                                            }}>
                                            Khusus Member
                                        </h4>
                                        <Link
                                            href="/utbk/try-out?access_type=member"
                                            className="flex flex-col gap-1 p-3">
                                            <h5 className="text-white text-base leading-[140%] font-semibold">
                                                Try Out Harian
                                            </h5>
                                            <p className="text-[#999999] text-sm leading-[160%]">
                                                Latihan rutin soal UTBK setiap
                                                hari.
                                            </p>
                                        </Link>
                                        <Link
                                            href="/utbk/try-out?access_type=member"
                                            className="flex flex-col gap-1 p-3">
                                            <h5 className="text-white text-base leading-[140%] font-semibold">
                                                Try Out Mingguan
                                            </h5>
                                            <p className="text-[#999999] text-sm leading-[160%] whitespace-nowrap">
                                                Simulasi try out UTBK secara
                                                berkala.
                                            </p>
                                        </Link>
                                    </section>
                                </div>
                            </div>
                        </NavigationMenuItem>

                        <NavigationMenuItem
                            isActive={router.pathname.includes(
                                '/utbk/prediksi-ptn'
                            )}
                            label="Prediksi PTN"
                            href="/utbk/prediksi-ptn"
                        />
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

                <button
                    type="button"
                    className="lg:hidden"
                    onClick={() => setShowMobileMenu(true)}>
                    <img
                        src={`${CDN_URL}/assets/utbk/hamburger.svg`}
                        alt="Menu"
                        height={24}
                        width={24}
                    />
                </button>

                <section className="gap-4 h-[34px] hidden lg:flex">
                    <Button
                        variant="secondary"
                        href="/masuk"
                        className="text-sm leading-[125%] !px-4 h-full">
                        Masuk
                    </Button>
                    <Button
                        variant="primary"
                        href="/daftar"
                        className="text-sm leading-[125%] !px-4 h-full">
                        Coba Gratis
                    </Button>
                </section>
            </div>

            <MobileSidebar
                courses={courses}
                open={showMobileMenu}
                setOpen={setShowMobileMenu}
            />
        </header>
    );
}

export default UTBKNavbar;
