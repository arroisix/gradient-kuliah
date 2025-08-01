import { useAddUserCardMutation } from 'payment/redux/api/transactionApi';
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState
} from 'react';

type SaveUserCardFn = (payload: AddCardRequestData) => Promise<CreditCard>;

interface CreditCardContextType {
    cardData?: any;
    setCardData: (data?: any) => void;
    saveUserCard: SaveUserCardFn;
    isSaving: boolean;
    successSaving: boolean;
}

const CreditCardContext = createContext<CreditCardContextType>(
    {} as CreditCardContextType
);

interface Props {
    children: ReactNode;
}

export const CreditCardProvider: React.FC<Props> = ({ children }) => {
    const [cardData, setCardData] = useState<any>();
    const [addUserCard, { isLoading: isSaving, isSuccess: successSaving }] =
        useAddUserCardMutation();

    const saveUserCard = useCallback<SaveUserCardFn>(
        async (payload) => {
            return await addUserCard(payload).unwrap();
        },
        [addUserCard]
    );

    const memoedValue = useMemo(
        () => ({
            cardData,
            setCardData,
            saveUserCard,
            isSaving,
            successSaving
        }),
        [cardData, isSaving, saveUserCard, successSaving]
    );

    return (
        <CreditCardContext.Provider value={memoedValue}>
            {children}
        </CreditCardContext.Provider>
    );
};

export const useCreditCardContext = (): CreditCardContextType =>
    useContext(CreditCardContext);

export default CreditCardContext;
