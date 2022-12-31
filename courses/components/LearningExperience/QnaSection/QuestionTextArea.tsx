import { useLearning } from 'courses/contexts/LearningProvider';
import { usePostQuestionMutation } from 'courses/redux/api/learningExperienceApi';
import { Formik } from 'formik';

import QnaTextArea from './TextArea';

interface QnaFormInputData {
    content: string;
    attachment?: string;
}

const QuestionTextArea = (): JSX.Element => {
    const { video } = useLearning();
    const [postQuestion, {}] = usePostQuestionMutation();

    return (
        <Formik
            initialValues={{
                content: '',
                attachment: ''
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
                    video_id: video.id,
                    is_anonymous: false
                });

                resetForm({
                    values: {
                        content: '',
                        attachment: ''
                    }
                });
            }}>
            {({
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                isValid,
                values
            }) => (
                <form
                    className="flex justify-start gap-2"
                    onSubmit={handleSubmit}>
                    <QnaTextArea
                        onCancel={() => undefined}
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
