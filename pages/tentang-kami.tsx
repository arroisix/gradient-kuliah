import Button from 'commons/components/elements/Button';
import Layout from 'commons/layout';

const About = (): JSX.Element => {
    return (
        <Layout>
            <section className="min-h-screen pt-24 px-4 md:px-[7.5rem] lg:px-[22rem]">
                <h1 className="text-3xl md:text-4xl font-bold">Tentang Kami</h1>
                <div className="w-full h-full rounded-md p-4 md:p-8 bg-[#121212] mt-4 md:mt-8 mb-4 md:mb-8 flex flex-col">
                    <p>
                        Kami membuat orang cinta belajar dan membantu mereka
                        mencapai potensi maksimalnya.
                    </p>
                    <h3 className="text-2xl my-4 text-center">
                        “Pendidikan adalah menyalakan sebuah api, bukan mengisi
                        sebuah bejana.” Socrates
                    </h3>
                    <p>
                        Kami percaya belajar tidak harus membosankan. Belajar
                        seharusnya menyenangkan dan menginspirasi. Membantu kita
                        untuk melihat dunia dari perspektif yang berbeda.
                    </p>
                    <p className="my-4">
                        Karena itu, kami mengumpulkan pengajar terbaik dari tiap
                        disiplin. Memperlengkapi dengan metodologi belajar yang
                        terbukti untuk memastikan setiap murid dapat mengerti
                        materi yang diberikan.
                    </p>
                    <div className="w-full flex justify-center">
                        <img
                            src="https://d2uqn6ndx4ow3t.cloudfront.net/assets/Irisan.png"
                            alt="irisan"
                            className="w-96"
                        />
                    </div>
                    <p className="my-4">
                        Kami juga menyadari masih banyak orang yang belum
                        berkesempatan untuk melanjutkan pendidikan tinggi karena
                        keterbatasan ekonomi.
                    </p>
                    <p>
                        Itulah mengapa kami dengan sengaja menetapkan harga yang
                        lebih rendah dibandingkan institusi, dengan tujuan semua
                        orang mendapat akses pendidikan terbaik. Kedepan, kami
                        juga akan menyediakan beasiswa untuk membantu orang
                        memiliki titik mulai yang setara dan memiliki kesempatan
                        untuk mencapai potensi maksimalnya.{' '}
                    </p>
                </div>
                <div className="w-full h-full rounded-md p-4 md:p-8 bg-[#121212] mb-8 flex flex-col md:flex-row items-center md:justify-between">
                    <h3 className="font-bold mb-2 md:mb-0">
                        Bergabung Bersama Kami
                    </h3>
                    <Button variant="primary" href="/karir">
                        Karir di Gradient
                    </Button>
                </div>
            </section>
        </Layout>
    );
};

About.displayName = 'About';
export default About;
