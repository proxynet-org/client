import * as yup from 'yup';

const CreatePostSchema = [
  yup.object().shape({
    media: yup.mixed().required('form.required'),
  }),
  yup.object().shape({
    title: yup.string().required('form.required'),
  }),
];

export default CreatePostSchema;
