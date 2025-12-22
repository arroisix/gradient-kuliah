import Link from 'next/link';
import Footer from './components/modules/Footer';
import { CDN_URL } from './constants';
import Button from './components/elements/Button';
import { Popover, Transition } from '@headlessui/react';
import { ChartPieIcon, ChevronDownIcon, FingerprintIcon } from 'lucide-react';
import { HiArrowPath, HiCursorArrowRays, HiSquaresPlus } from 'react-icons/hi2';
import { Fragment } from 'react';

interface LayoutProps {
    children?: JSX.Element;
}

function Layout({ children }: LayoutProps): JSX.Element {
    return (
        <div className="bg-black">
            <Navbar />
            {children}
            <Footer className="!bg-black" />
        </div>
    );
}

const solutions = [
    {
        name: 'Analytics',
        description: 'Get a better understanding of your traffic',
        href: '#',
        icon: ChartPieIcon
    },
    {
        name: 'Engagement',
        description: 'Speak directly to your customers',
        href: '#',
        icon: HiCursorArrowRays
    },
    {
        name: 'Security',
        description: "Your customers' data will be safe and secure",
        href: '#',
        icon: FingerprintIcon
    },
    {
        name: 'Integrations',
        description: 'Connect with third-party tools',
        href: '#',
        icon: HiSquaresPlus
    },
    {
        name: 'Automations',
        description: 'Build strategic funnels that will convert',
        href: '#',
        icon: HiArrowPath
    }
];

function Navbar(): JSX.Element {
    return (
        <header className="flex fixed top-0 z-50 w-full justify-center lg:mt-[10px]">
            <div
                className="flex justify-between items-center w-full px-8 bg-white bg-opacity-[3%] border-solid border-[1px] border-white border-opacity-[8%] rounded-full h-[60px] m-4 max-w-[1232px]"
                style={{
                    boxShadow: '0px 25px 50px -12px rgba(88, 28, 135, 0.1)',
                    backdropFilter: 'blur(8px)'
                }}>
                <Link
                    href="/utbk"
                    className="text-2xl leading-6 tracking-[0.08px] font-bold font-[Urbanist] text-[#E9E9E9]">
                    Gradient
                </Link>

                <Popover.Group as="section" className="hidden lg:flex gap-8">
                    <Popover className="relative">
                        <Popover.Button className="inline-flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 dark:text-white">
                            <span>Materi</span>
                            <ChevronDownIcon
                                aria-hidden="true"
                                className="size-5"
                            />
                        </Popover.Button>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1">
                            <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 bg-transparent px-4 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in">
                                <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 shadow-lg outline-1 outline-gray-900/5 dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
                                    <div className="p-4">
                                        {solutions.map((item) => (
                                            <div
                                                key={item.name}
                                                className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-white/5">
                                                <div className="mt-1 flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white dark:bg-gray-700/50 dark:group-hover:bg-gray-700">
                                                    <item.icon
                                                        aria-hidden="true"
                                                        className="size-6 text-gray-600 group-hover:text-indigo-600 dark:text-gray-400 dark:group-hover:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <a
                                                        href={item.href}
                                                        className="font-semibold text-gray-900 dark:text-white">
                                                        {item.name}
                                                        <span className="absolute inset-0" />
                                                    </a>
                                                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </Popover>

                    <Popover className="relative">
                        <Popover.Button className="inline-flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 dark:text-white">
                            <span>Try Out</span>
                            <ChevronDownIcon
                                aria-hidden="true"
                                className="size-5"
                            />
                        </Popover.Button>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1">
                            <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 bg-transparent px-4 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in">
                                <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 shadow-lg outline-1 outline-gray-900/5 dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
                                    <div className="p-4">
                                        {solutions.map((item) => (
                                            <div
                                                key={item.name}
                                                className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-white/5">
                                                <div className="mt-1 flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white dark:bg-gray-700/50 dark:group-hover:bg-gray-700">
                                                    <item.icon
                                                        aria-hidden="true"
                                                        className="size-6 text-gray-600 group-hover:text-indigo-600 dark:text-gray-400 dark:group-hover:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <a
                                                        href={item.href}
                                                        className="font-semibold text-gray-900 dark:text-white">
                                                        {item.name}
                                                        <span className="absolute inset-0" />
                                                    </a>
                                                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </Popover>
                </Popover.Group>

                <button type="button" className="lg:hidden">
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
        </header>
    );
}

export default Layout;
