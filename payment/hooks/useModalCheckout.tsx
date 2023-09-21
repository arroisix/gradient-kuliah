import { useState } from 'react';

const useModalCheckout = () => {
    const [isOpen, setOpen] = useState<boolean>(false);

    return { isOpen, setOpen };
};

export default useModalCheckout;
