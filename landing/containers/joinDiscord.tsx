import Button from 'commons/components/elements/Button';

const JoinDiscord = (): JSX.Element => {
    return (
        <section
            className="px-4 md:px-[7.5rem] py-4 h-[80vh] flex items-center justify-center flex-col mt-32"
            style={{
                background: `url(https://d2uqn6ndx4ow3t.cloudfront.net/assets/discord.png)`,
                backgroundSize: 'cover',
                // backgroundRepeat: 'no-repeat'
                backgroundPosition: 'center'
            }}>
            <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-[#9571E3] to-[#BF4F44] text-transparent bg-clip-text text-center">
                Gabung Komunitas Gradient
            </h1>
            <span className="text-white font-body my-2 lg:my-4 text-xl lg:text-3xl text-center">
                ngobrolin keluh kesah kuliah~
            </span>
            <Button variant="primary" href="https://discord.gg/ZC8R3ePHVF">
                Gabung Discord
            </Button>
        </section>
    );
};

export default JoinDiscord;
