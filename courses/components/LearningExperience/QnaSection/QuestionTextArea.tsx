import { useLearning } from 'courses/contexts/LearningProvider';
import { usePostQuestionMutation } from 'courses/redux/api/learningExperienceApi';
import { Formik } from 'formik';

import QnaTextArea from './TextArea';

interface QnaFormInputData {
    content: string;
    attachment?: string;
    is_anonymous: boolean;
}

const QuestionTextArea = (): JSX.Element => {
    const { video } = useLearning();
    const [postQuestion, {}] = usePostQuestionMutation();

    return (
        <Formik
            initialValues={{
                content: '',
                attachment: '',
                is_anonymous: false
            }}
            validate={(values: QnaFormInputData) => {
                const errors = {} as QnaFormInputData;
                if (values.content.length <= 0) {
                    errors.content = 'Pertanyaan tidak boleh kosong';
                }

                return errors;
            }}
            onSubmit={async (values, { resetForm }) => {
                await postQuestion({
                    ...values,
                    video_id: video.id
                });

                resetForm({
                    values: {
                        content: '',
                        attachment: '',
                        is_anonymous: false
                    }
                });
            }}>
            {({
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                isSubmitting,
                isValid,
                values
            }) => (
                <form
                    className="flex justify-start gap-2"
                    onSubmit={handleSubmit}>
                    <QnaTextArea
                        placeholder="Punya pertanyaan terkait materi?"
                        key="question"
                        setFieldValue={setFieldValue}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        values={values}
                        disabled={isSubmitting || !isValid}
                    />
                </form>
            )}
        </Formik>
    );
};

export default QuestionTextArea;
