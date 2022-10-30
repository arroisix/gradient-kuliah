import { useContext, useState } from 'react';
import Modal from 'commons/components/modules/Modal';
import DialogSuccess from '../SuccessDialog';
import RegistrationContext from 'authentication/contexts/RegistrationProvider';
import RegistrationSection from './registrationSection';
import ReferenceSection from './referenceSection';

const formStep = (step: number): React.ReactNode => {
    switch (step) {
        case 0:
            return <RegistrationSection />;
        case 1:
            return <ReferenceSection />;
        default:
            return null;
    }
};

const ModalOnboarding = ({ isOpen, setOpen }: ModalBaseProps): JSX.Element => {
    const [success, setSuccess] = useState<1 | 0>(0);
    const { step } = useContext(RegistrationContext);

    return (
        <>
            <Modal isOpen={isOpen ? 1 : 0} setOpen={() => setOpen(0)} permanent>
                {formStep(step)}
            </Modal>
            <DialogSuccess isOpen={success} setOpen={setSuccess} />
        </>
    );
};

export default ModalOnboarding;
