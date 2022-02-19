import { useCheckout } from '../contexts/TransactionProvider';
import { LOGO_PAYMENT } from './constant';
import Image from 'next/image';
import { useState } from 'react';
import guide from '../contents/checkoutGuide.json';

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
        <div className="w-full flex border-b-2 border-neutral-800">
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
        <div className="w-full flex mb-4">
            <div className="w-[250px] h-[150px] bg-neutral-400 rounded mr-2"></div>
            <div>
                <p className="text-2xl">
                    {index + 1}. {step.description}
                </p>
            </div>
        </div>
    );
};

const TabContent = ({ tab }: { tab: number }) => {
    const { transaction } = useCheckout();
    return (
        <div className="py-8">
            {guide[transaction.paymentMethod]?.step[tab].map((s, index) => (
                <GuideStep step={s} index={index} key={index + 'key'} />
            ))}
        </div>
    );
};

const TransactionGuide = (): JSX.Element => {
    const { transaction } = useCheckout();
    const [tab, setTab] = useState(0);

    return (
        <div className="w-full mt-4">
            <div className="w-full flex justify-between">
                <h5 className="font-bold text-2xl">Cara Bayar</h5>
                <div className="rounded-lg h-[50px] w-[150px] bg-white mr-2 flex items-center justify-center">
                    <div className="h-[35px] w-[100px] relative">
                        <Image
                            src={`https://d2uqn6ndx4ow3t.cloudfront.net/assets/payments/${
                                LOGO_PAYMENT[transaction.paymentMethod]
                            }`}
                            layout="fill"
                        />
                    </div>
                </div>
            </div>
            <TabOption
                tab={tab}
                setTab={setTab}
                options={guide[transaction.paymentMethod]?.method}
            />
            <TabContent tab={tab} />
        </div>
    );
};

export default TransactionGuide;
