import { FaInstagram } from 'react-icons/fa';
import Accordion from 'commons/components/elements/Accordion';
import Button from 'commons/components/elements/Button';

const FAQSection = ({ content }: { content?: CourseFaq[] }): JSX.Element => {
    return (
        <div className="w-screen py-16 flex-col px-4 md:px-[7.5rem] mb-16">
            <div className="w-full md:text-center">
                <h1 className="text-2xl md:text-4xl font-bold mb-4">
                    Pertanyaan yang sering ditanyakan.
                </h1>
            </div>
            <div className="w-full">
                {content && (
                    <Accordion
                        item={content.map((faq: CourseFaq) => ({
                            title: faq.question,
                            content: faq.answer
                        }))}
                    />
                )}
            </div>
            <div className="w-full flex flex-col md:flex-row justify-center items-center mt-16">
                <p className="md:mr-4">Ada yang mau kamu tanya?</p>
                <div className="mt-4 md:mt-0">
                    <Button
                        variant="primary"
                        href="https://www.instagram.com/gradient_idn/">
                        <span className="flex items-center">
                            <FaInstagram className="mr-2" /> Hubungi Kami
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FAQSection;
