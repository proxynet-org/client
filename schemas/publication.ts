import * as yup from 'yup';

const CreatePublicationSchema = [
  yup.object().shape({
    image: yup.mixed().required('form.required'),
  }),
  yup.object().shape({
    title: yup.string().required('form.required'),
  }),
];

export default CreatePublicationSchema;
