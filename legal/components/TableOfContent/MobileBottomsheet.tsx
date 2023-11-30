import Button from 'commons/components/elements/Button';
import Modal from 'commons/components/modules/Modal';
import { slugify } from 'commons/utils';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaListUl } from 'react-icons/fa';

const MobileBottomsheet = ({ headings }: LegalTocProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const handleScroll = (): void => setScrollPosition(window.scrollY);
    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <Modal variant="dark" isOpen={isOpen} setOpen={setIsOpen}>
                <h2 className="pb-5 text-xs uppercase text-neutral-400 font-body">
                    Daftar Isi
                </h2>
                <div className="space-y-4">
                    {headings.map((heading) => (
                        <Link
                            href={`#${slugify(heading)}`}
                            key={heading}
                            onClick={() => setIsOpen(false)}
                            className="block font-sans text-sm font-bold hover:text-accent-purple">
                            {heading}
                        </Link>
                    ))}
                </div>
            </Modal>
            {scrollPosition > 240 && (
                <Button
                    variant="primary"
                    onClick={() => setIsOpen(true)}
                    className="md:hidden fixed grid btn-circle bottom-5 right-4 place-items-center !p-0">
                    <FaListUl className="rotate-180" />
                </Button>
            )}
        </>
    );
};

export default MobileBottomsheet;
