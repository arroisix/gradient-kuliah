import Button from 'commons/components/elements/Button';
import Layout from 'commons/layout';
import Features from '../landing/components/Sections/Features';
import { CDN_URL } from "../commons/constants";
import Image from "next/image";

const NotFound = (): JSX.Element => {
    return (
      <Layout isFullBlackBackground>
        <div className="flex flex-col items-center justify-center min-h-screen pt-8 md:pt-20 gap-8">
          <div className="flex flex-col items-center gap-4 px-4 md:px-8">
            <h1 className="text-xl font-sans font-bold text-center">Page Not Found</h1>
            <p className="text-base font-body text-center">Maaf, kami tidak bisa menemukan halaman yang kamu cari</p>
          </div>
          <div className="relative w-full max-w-96 md:max-w-3xl">
            <div className="w-full h-0 pb-[40%]">
              <Image
                src={`${CDN_URL}/assets/404.png`}
                priority
                alt="404"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
          <Features />
          {/*<Button href="/" variant="primary" className="mt-8">*/}
          {/*  Kembali*/}
          {/*</Button>*/}
        </div>
      </Layout>
    );
};

export default NotFound;
