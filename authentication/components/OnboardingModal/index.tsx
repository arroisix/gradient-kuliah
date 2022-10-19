import { useState } from 'react';
import Modal from 'commons/components/modules/Modal';
import DialogSuccess from '../SuccessDialog';
import FormSection from './form';

const ModalOnboarding = ({ isOpen, setOpen }: ModalBaseProps): JSX.Element => {
    const [success, setSuccess] = useState<1 | 0>(0);

    return (
        <>
            <Modal isOpen={isOpen ? 1 : 0} setOpen={() => setOpen(0)} permanent>
                {/* <div className="w-full flex flex-col">
                    <h1 className="text-3xl text-center font-bold mb-8">
                        Lengkapi Akunmu
                    </h1> */}
                <FormSection openDialog={setSuccess} />
                {/* </div> */}
            </Modal>
            <DialogSuccess isOpen={success} setOpen={setSuccess} />
        </>
    );
};

export default ModalOnboarding;
