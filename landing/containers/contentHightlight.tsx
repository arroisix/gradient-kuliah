import Link from 'next/link';
import Container from 'commons/components/elements/Container';
import Image from 'next/image';

const ContentCard = ({
    cover,
    slug,
    title,
    description
}: {
    cover: string;
    slug: string;
    title: string;
    description: string;
}): JSX.Element => {
    return (
        <Link href={`/kelas/${slug}`}>
            <div className="rounded-3xl h-[480px] w-1/2 max-w-[350px] overflow-hidden relative cursor-pointer">
                <Image
                    src={cover}
                    loading="lazy"
                    className="object-cover object-bottom"
                    height={480}
                    width={350}
                />
                <div className="w-[200%] -left-16 h-[70%] lg:h-[40%] bg-neutral-900 absolute bottom-0 blur-md"></div>
                <div className="w-full h-[60%] lg:h-1/3 bg-neutral-900 absolute bottom-0 p-4">
                    <h3 className="text-lg font-bold">{title}</h3>
                    <p className="text-xs font-body font-thin">{description}</p>
                </div>
                <div className="w-full absolute bottom-0 left-0 bg-accent-purple px-4 py-2 text-center">
                    <span className="font-bold text-xs lg:text-base">
                        Gabung Kelas
                    </span>
                </div>
            </div>
        </Link>
    );
};

const ContentHighlight = (): JSX.Element => {
    return (
        <Container>
            <div className="text-center">
                <h2 className="text-3xl font-bold">
                    Pilih Kelas Sesuai Kebutuhanmu
                </h2>
                <h4 className="text-2xl font-body font-thin text-neutral-200">
                    Mengenal jurusanmu lebih dekat dan pelajari materinya secara
                    mendalam
                </h4>
            </div>
            <div className="flex gap-4 items-center justify-center my-4 relative">
                <div
                    className="hidden lg:block w-[170px] h-[170px] rounded-full absolute -bottom-14 left-16 lg:left-36 xl:left-32"
                    style={{
                        background:
                            'linear-gradient(330.33deg, #434343 4.61%, #030C14 84.77%)',
                        transform: 'matrix(-1, 0, 0, 1, 0, 0)'
                    }}
                />
                <ContentCard
                    cover="https://d2uqn6ndx4ow3t.cloudfront.net/lecturers/theo-profile.jpg"
                    slug="kalkulus1"
                    title="Kalkulus 1"
                    description="Jembatan yang memampukan kita untuk mengkuantifikasi perubahan"
                />
                <div
                    className="w-[320px] h-[320px] rounded-full absolute right-16 hidden lg:block"
                    style={{
                        background:
                            'linear-gradient(49.01deg, #970D00 17.94%, #030C14 86.52%)',
                        mixBlendMode: 'normal',
                        filter: 'blur(2px)'
                    }}
                />
                <ContentCard
                    cover="https://d2uqn6ndx4ow3t.cloudfront.net/lecturers/asih_portrait.jpg"
                    slug="ptsl"
                    title="Pengantar Teknik Sipil dan Lingkungan"
                    description="Bukan hanya tentang pembangunan fisik, kita akan melihat bagaimana teknik membangun peradaban manusia"
                />
            </div>
        </Container>
    );
};

export default ContentHighlight;
