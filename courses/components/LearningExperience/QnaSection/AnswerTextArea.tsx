import { usePostAnswerMutation } from 'courses/redux/api/learningExperienceApi';
import { Formik } from 'formik';

import QnaTextArea from './TextArea';

interface QnaFormInputData {
    content: string;
    attachment?: string;
}

const AnswerTextArea = ({
    questionId,
    onCancel
}: {
    questionId: string;
    onCancel: () => void;
}): JSX.Element => {
    const [postAnswer, {}] = usePostAnswerMutation();

    return (
        <Formik
            initialValues={{
                content: '',
                attachment: ''
            }}
            validate={(values: QnaFormInputData) => {
                const errors = {} as QnaFormInputData;
                if (values.content.length <= 0) {
                    errors.content = 'Jawaban tidak boleh kosong';
                }

                return errors;
            }}
            onSubmit={async (values, { resetForm }) => {
                await postAnswer({
                    ...values,
                    question_id: questionId,
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
                        onCancel={onCancel}
                        avatarSize="h-[45px] w-[45px]"
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

export default AnswerTextArea;
