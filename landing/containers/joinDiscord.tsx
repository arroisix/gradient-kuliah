import Button from 'commons/components/elements/Button';
import CommunityPreview from 'landing/components/CommunityPreview';

const JoinDiscord = (): JSX.Element => {
    return (
        <section className="px-4 md:px-[16rem] py-8 flex items-center justify-center flex-col-reverse md:flex-row lg:mt-16">
            <div className="w-full text-center lg:text-left -mt-16 lg:mt-0 flex flex-col items-center md:items-start">
                <h2 className="text-lg lg:text-5xl font-bold">
                    Gabung Komunitas Gradient
                </h2>
                <p className="text-sm lg:text-2xl font-body font-thin text-neutral-200 my-2">
                    Lebih dari 50 universitas sudah bergabung dalam Gradient
                </p>
                <Button
                    variant="primary"
                    href="https://discord.gg/qU3SB6wxzY"
                    className="w-fit">
                    Gabung Komunitas
                </Button>
            </div>
            <div className="w-full lg:w-1/2 h-full flex justify-center items-center">
                <CommunityPreview />
            </div>
        </section>
    );
};

export default JoinDiscord;
