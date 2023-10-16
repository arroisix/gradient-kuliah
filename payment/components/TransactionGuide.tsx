import { LOGO_PAYMENT } from './constant';
import Image from 'next/image';
import { useState } from 'react';
import guideContent from '../contents/checkoutGuide.json';
import { useGetTransactionQuery } from 'payment/redux/api/transactionApi';
import { useRouter } from 'next/router';
import { useTracker } from 'tracker/tracker';

const Option = ({
    title,
    isActive,
    onClick
}: {
    title: string;
    isActive: boolean;
    onClick: () => void;
}): JSX.Element => {
    return (
        <div
            onClick={onClick}
            aria-hidden={true}
            className={`text-base text-center px-5 py-2 cursor-pointer relative ${
                isActive
                    ? 'font-bold text-accent-blue'
                    : 'font-thin text-neutral-200'
            }`}>
            <span>{title}</span>
            {isActive && (
                <div className="h-[4px] bg-accent-blue w-full absolute bottom-[-2px] left-0" />
            )}
        </div>
    );
};

const TabOption = ({
    tab,
    setTab,
    options
}: {
    tab: number;
    setTab: (tab: number) => void;
    options: string[];
}): JSX.Element => {
    return (
        <div className="flex w-full border-b-2 border-neutral-800">
            {options?.map((option, index) => (
                <Option
                    title={option}
                    isActive={tab === index}
                    onClick={() => setTab(index)}
                    key={option}
                />
            ))}
        </div>
    );
};

interface GuideStepProps {
    step: {
        asset: string;
        description: string;
    };
    index: number;
}

const GuideStep = ({ step, index }: GuideStepProps): JSX.Element => {
    return (
        <div className="flex w-full mb-4">
            {/* <div className="w-[250px] h-[150px] bg-neutral-400 rounded mr-2"></div> */}
            <div>
                <p className="md:text-2xl">
                    {index + 1}. {step.description}
                </p>
            </div>
        </div>
    );
};

const TabContent = ({ tab }: { tab: number }): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const { data: transaction } = useGetTransactionQuery(id as string, {
        skip: id === undefined || id === null
    });

    const guide = guideContent as GuideContent;

    return (
        <div className="py-8">
            {guide?.[transaction?.payment_method ?? '']?.step[tab].map(
                (s, index) => (
                    <GuideStep step={s} index={index} key={index + 'key'} />
                )
            )}
        </div>
    );
};

const TransactionGuide = (): JSX.Element => {
    const tracker = useTracker();
    const router = useRouter();
    const { id } = router.query;
    const { data: transaction, isLoading } = useGetTransactionQuery(
        id as string,
        {
            skip: id === undefined || id === null
        }
    );
    const [tab, setTab] = useState(0);

    if (isLoading) {
        return (
            <div className="p-4 h-[40vh] w-full bg-neutral-600 animate-pulse rounded-lg" />
        );
    }

    const guide = guideContent as GuideContent;
    if (transaction && !guide[transaction?.payment_method]) return <></>;

    const tabOptions = guide[transaction?.payment_method as PaymentMethod]
        ?.method as string[];

    function handleTabChange(tabNumber: number): void {
        setTab(tabNumber);
        tracker?.genericTrack('Click Payment Guide Tab', {
            'Payment Type': tabOptions[tabNumber],
            'Transaction ID': id
        });
    }

    return (
        <div className="w-full mt-4">
            <div className="flex justify-between w-full">
                <h5 className="text-2xl font-bold">Cara Bayar</h5>
                <div className="rounded-lg h-[50px] w-[150px] bg-white mr-2 flex items-center justify-center">
                    <div className="h-[35px] w-[100px] relative">
                        <Image
                            src={`https://d2uqn6ndx4ow3t.cloudfront.net/assets/payments/${
                                LOGO_PAYMENT[
                                    transaction?.payment_method as PaymentMethod
                                ]
                            }`}
                            className="object-contain"
                            layout="fill"
                        />
                    </div>
                </div>
            </div>
            <TabOption
                tab={tab}
                setTab={handleTabChange}
                options={tabOptions}
            />
            <TabContent tab={tab} />
        </div>
    );
};

export default TransactionGuide;
