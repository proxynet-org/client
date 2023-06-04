import * as yup from 'yup';

const CreateChatroomSchema = yup.object().shape({
  name: yup.string().required('form.required'),
  description: yup
    .string()
    .required('form.required')
    .max(100, 'form.description.errorLength'),
  lifetime: yup.number().required('form.required'),
  capacity: yup.number().required('form.required'),
  image: yup.mixed().required('form.required'),
});

export default CreateChatroomSchema;
