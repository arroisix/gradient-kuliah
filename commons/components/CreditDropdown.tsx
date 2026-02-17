import { formatCurrency } from 'commons/utils';
import { SparklesIcon } from 'lucide-react';
import { useGetUserCreditQuery } from 'copilot/redux/api/copilotApi';
import { DropdownMenu } from 'radix-ui';
import Button from './elements/Button';
import { useState } from 'react';
import Modal from 'commons/components/modules/Modal';

const CreditDropdown = (): JSX.Element => {
    const { data, isLoading } = useGetUserCreditQuery();

    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
            {/* Desktop: radix dropdown */}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button className="hidden lg:flex gap-2 items-center !py-1 !px-3 border border-neutral-400 rounded-full text-white hover:border-gray-700 hover:bg-graphite-800 transition-colors duration-200">
                        <SparklesIcon
                            size={16}
                            color="#E48E0D"
                            fill="#E48E0D"
                        />
                        <span className="text-sm font-semibold text-white">
                            {isLoading || !data
                                ? '—'
                                : formatCurrency(
                                      data.credit as unknown as string
                                  )
                                      .slice(2)
                                      .split(',')[0]}
                        </span>
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        loop
                        side="bottom"
                        sideOffset={8}
                        className="w-[260px] bg-[#222222] rounded-2xl overflow-hidden shadow-lg text-white">
                        <div className="p-4 flex flex-col justify-center gap-4">
                            <div className="flex items-center justify-center gap-2">
                                <SparklesIcon
                                    size={16}
                                    color="#E48E0D"
                                    fill="#E48E0D"
                                />
                                <h3 className="text-white font-semibold text-sm">
                                    Credit Balance
                                </h3>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">
                                    {isLoading || !data
                                        ? '—'
                                        : formatCurrency(
                                              data.credit as unknown as string
                                          )
                                              .slice(2)
                                              .split(',')[0]}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-[#2c2c2c]">
                            <Button
                                variant="primary"
                                size="small"
                                className="w-full">
                                Top Up Credit
                            </Button>
                        </div>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {/* Mobile: bottom sheet */}
            <div className="flex lg:hidden">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="flex gap-2 items-center py-1 px-3 border border-neutral-400 rounded-full text-white hover:border-gray-700 hover:bg-graphite-800 transition-colors duration-200">
                    <SparklesIcon size={16} color="#E48E0D" fill="#E48E0D" />
                    <span className="text-sm font-semibold text-white">
                        {isLoading || !data
                            ? '—'
                            : formatCurrency(data.credit as unknown as string)
                                  .slice(2)
                                  .split(',')[0]}
                    </span>
                </button>
            </div>

            <Modal
                isOpen={isMobileOpen}
                setOpen={setIsMobileOpen}
                variant="dark"
                className="!max-w-full !w-full !m-0 !rounded-t-2xl !rounded-b-none fixed bottom-0 left-0 right-0 !max-h-[70vh] flex flex-col p-0 !overflow-hidden bg-[#222222] z-[10000]">
                <div className="p-4 flex flex-col justify-center gap-4">
                    <div className="flex items-center justify-center gap-2">
                        <SparklesIcon
                            size={16}
                            color="#E48E0D"
                            fill="#E48E0D"
                        />
                        <h3 className="text-white font-semibold text-sm">
                            Credit Balance
                        </h3>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">
                            {isLoading || !data
                                ? '—'
                                : formatCurrency(
                                      data.credit as unknown as string
                                  )
                                      .slice(2)
                                      .split(',')[0]}
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-[#2c2c2c]">
                    <Button variant="primary" size="small" className="w-full">
                        Top Up Credit
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default CreditDropdown;
