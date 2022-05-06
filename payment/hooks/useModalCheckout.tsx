import { useState } from 'react';

const useModalCheckout = () => {
    const [isOpen, setOpen] = useState<0 | 1>(0);

    return { isOpen, setOpen };
};

export default useModalCheckout;
