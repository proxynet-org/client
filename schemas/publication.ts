import * as yup from 'yup';

const CreatePublicationSchema = [
  yup.object().shape({
    image: yup.mixed().required('form.required'),
  }),
  yup.object().shape({
    title: yup.string().required('form.required'),
    text: yup.string().required('form.required').max(100, 'form.max'),
  }),
];

export default CreatePublicationSchema;
