import AddCardForm from 'profile/components/kartu-kredit/AddCardForm';
import { CreditCardProvider } from 'profile/contexts/CreditCardProvider';

const AddCardContainer = (): JSX.Element => {
    return (
        <CreditCardProvider>
            <AddCardForm />
        </CreditCardProvider>
    );
};

export default AddCardContainer;
