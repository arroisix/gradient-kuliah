import GradientIcon from 'commons/components/GradientIcon';
import Button from 'commons/components/elements/Button';
import { AUTHENTICATION_ROUTE } from 'commons/constants';
import { queryParamBuilder } from 'commons/utils';
import { useRouter } from 'next/router';

const CTAOverlay = (): JSX.Element => {
    const router = useRouter();

    return (
        <div
            aria-hidden={true}
            className="absolute w-full h-full bg-[#000000]/[0.75] px-7">
            <div className="w-full bg-[#5F2BCE] mt-14 rounded-lg px-6 py-5">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-3.5 items-center text-sm">
                        <GradientIcon />
                        <span className="font-body">
                            Daftar sekarang untuk membuat program
                        </span>
                    </div>
                    <Button
                        variant="custom"
                        className="text-white bg-black text-center"
                        href={`${AUTHENTICATION_ROUTE}?${queryParamBuilder({
                            redirect: router.asPath + '?ask=true'
                        })}`}>
                        Buat Program Gratis
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CTAOverlay;
