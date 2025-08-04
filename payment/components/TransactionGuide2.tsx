import Accordion from 'commons/components/elements/Accordion';
import { useRouter } from 'next/router';
import { useGetTransactionQuery } from 'payment/redux/api/transactionApi';
import guideContent from '../contents/checkoutGuide.json';

interface GuideStepProps {
    step: {
        asset: string;
        description: string;
    };
    index: number;
}

const GuideStep = ({ step, index }: GuideStepProps): JSX.Element => {
    return (
        <li className="flex items-center gap-4">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#494BA0] shadow-md">
                <span className="font-body font-semibold text-base leading-none text-white">
                    {index + 1}
                </span>
            </div>
            <p className="font-body text-base leading-snug text-neutral-200">
                {step.description}
            </p>
        </li>
    );
};

const TransactionGuide = (): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const { data: transaction, isLoading } = useGetTransactionQuery(
        id as string,
        {
            skip: id === undefined || id === null
        }
    );

    if (isLoading) {
        return (
            <div className="p-4 h-[40vh] w-full bg-neutral-600 animate-pulse rounded-lg" />
        );
    }

    const guide = guideContent as GuideContent;
    const paymentMethodKey = transaction?.payment_method as string | undefined;
    if (!transaction || !paymentMethodKey || !guide[paymentMethodKey]) {
        return <></>;
    }

    const entry = guide[paymentMethodKey];
    const { method: methods, step: stepsArray } = entry;

    const accordionItems = methods.map((methodTitle, idx) => {
        const correspondingSteps = stepsArray[idx] ?? [];

        const jsxContent = (
            <ol className="list-none m-0 p-0 space-y-3">
                {correspondingSteps.length ? (
                    correspondingSteps.map((s, i) => (
                        <GuideStep step={s} index={i} key={i} />
                    ))
                ) : (
                    <li className="font-body text-lg">
                        Langkah tidak tersedia untuk metode ini.
                    </li>
                )}
            </ol>
        );

        return {
            title: methodTitle,
            jsxContent,
            isOpen: idx === 0
        };
    });

    return (
        <div className="flex flex-col items-start my-4">
            <h1 className="font-bold font-body text-lg mb-3">
                Petunjuk Pembayaran
            </h1>
            <Accordion
                item={accordionItems}
                className="w-full [&>button]:mt-1 [&>button]:rounded-md"
            />
        </div>
    );
};

export default TransactionGuide;
