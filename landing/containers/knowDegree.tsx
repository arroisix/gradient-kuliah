import Button from 'commons/components/elements/Button';
import Image from 'next/image';

const KnowDegree = (): JSX.Element => {
    return (
        <div
            className="px-4 md:px-[7.5rem] py-4 flex flex-col justify-center items-center min-h-[70vh] lg:min-h-[80vh] relative"
            style={{
                background:
                    'linear-gradient(178.8deg, rgba(0, 0, 0, 0.8) 1.01%, rgba(0, 0, 0, 0) 27.76%, rgba(0, 0, 0, 0) 78.96%, rgba(0, 0, 0, 0.8) 98.98%), linear-gradient(162.05deg, rgba(0, 0, 0, 0.1) 15.89%, rgba(22, 12, 44, 0.82) 50.43%, rgba(22, 12, 44, 0) 89.88%)',
                transform: 'matrix(-1, 0, 0, 1, 0, 0)'
            }}>
            <div
                className="absolute top-0 right-0 opacity-20 w-[330px] lg:w-[522px]"
                style={{
                    filter: 'drop-shadow(6px 6px 80px rgba(52, 2, 159, 0.1))'
                }}>
                <Image
                    src="https://assets.gradient.academy/assets/thumb-1.jpg"
                    loading="lazy"
                    className="object-cover"
                    // layout="fill"
                    height={330}
                    width={522}
                />
            </div>
            <div
                className="absolute top-32 left-0 opacity-20 w-[250px] lg:w-[393px]"
                style={{
                    filter: 'drop-shadow(6px 6px 80px rgba(52, 2, 159, 0.1))'
                }}>
                <Image
                    src="https://assets.gradient.academy/assets/thumb-3.jpg"
                    loading="lazy"
                    className="object-cover"
                    // layout="fill"
                    height={365}
                    width={393}
                />
            </div>
            <div
                className="absolute bottom-0 opacity-20 w-[250px] lg:w-[397px]"
                style={{
                    filter: 'drop-shadow(6px 6px 80px rgba(52, 2, 159, 0.1))'
                }}>
                <Image
                    src="https://assets.gradient.academy/assets/thumb-5.jpg"
                    loading="lazy"
                    className="object-cover"
                    // layout="fill"
                    height={317}
                    width={397}
                />
            </div>
            <h2
                className="text-lg lg:text-4xl font-bold text-center w-3/4 lg:w-1/2"
                style={{
                    transform: 'matrix(-1, 0, 0, 1, 0, 0)'
                }}>
                Mengenal jurusanmu lebih dekat, dari orang yang tepat.
            </h2>
            <div
                className="mt-4"
                style={{
                    transform: 'matrix(-1, 0, 0, 1, 0, 0)'
                }}>
                <Button variant="primary" href="/kelas">
                    Lihat Kelas
                </Button>
            </div>
        </div>
    );
};

export default KnowDegree;
