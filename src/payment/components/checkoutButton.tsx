import Button from 'src/commons/components/elements/Button';
import useCheckout from '../hooks/useCheckout';

const CheckoutButton = ({ packetId }: { packetId: string }): JSX.Element => {
    const { checkout } = useCheckout();

    const onClick = async (): Promise<void> => {
        const data = await checkout({
            variables: {
                packetId,
                paymentMethod: 'VA_BNI'
            }
        });

        if (data) {
            alert(JSON.stringify(data));
        }
    };

    return (
        <Button variant="primary" onClick={onClick}>
            Checkout
        </Button>
    );
};

export default CheckoutButton;
