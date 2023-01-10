import { Input, Button, Icon } from '@rneui/themed';
import { Container } from 'components';
import { Formik, FormikErrors } from 'formik';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(2, 'Too Short!')
    .max(70, 'Too Long!')
    .required('Required'),
  // email: Yup.string().email('Invalid email').required('Required'),
});

type InputParams = {
  name: 'email' | 'phone' | 'firstname' | 'lastname' | 'password';
  errors: FormikErrors<{
    email: string;
    phone: string;
    firstname: string;
    lastname: string;
    password: string;
  }>;
  values: {
    email: string;
    phone: string;
    firstname: string;
    lastname: string;
    password: string;
  };
  handleChange: (field: string) => (e: string | React.ChangeEvent) => void;
  handleBlur: (fieldOrEvent: string) => (e: unknown) => void;
};

function CustomInput({
  name,
  errors,
  values,
  handleChange,
  handleBlur,
}: InputParams) {
  return (
    <Input
      disabledInputStyle={{ backgroundColor: '#ddd' }}
      errorMessage={errors[name]}
      label={name}
      leftIcon={<Icon name="person" size={20} />}
      rightIcon={
        values[name].length > 0 && (
          <Icon name="close" size={20} onPress={() => handleChange(name)('')} />
        )
      }
      placeholder={`Enter ${name}`}
      onChangeText={handleChange(name)}
      onBlur={handleBlur(name)}
      value={values[name]}
    />
  );
}

export function RegisterScreen() {
  return (
    <Formik
      initialValues={{
        email: '',
        phone: '',
        firstname: '',
        lastname: '',
        password: '',
      }}
      onSubmit={(values) => console.log(values)}
      validationSchema={SignupSchema}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <Container>
          <Input
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            keyboardType="email-address"
          />
          <CustomInput
            name="lastname"
            errors={errors}
            values={values}
            handleChange={(e) => handleChange(e)}
            handleBlur={(e) => handleBlur(e)}
          />
          <Input
            disabledInputStyle={{ backgroundColor: '#ddd' }}
            errorMessage={errors.firstname}
            label="Name"
            leftIcon={<Icon name="person" size={20} />}
            rightIcon={
              values.firstname.length > 0 && (
                <Icon
                  name="close"
                  size={20}
                  onPress={() => handleChange('firstname')('')}
                />
              )
            }
            placeholder="Enter Name"
            onChangeText={handleChange('firstname')}
            onBlur={handleBlur('firstname')}
            value={values.firstname}
          />
          <Button
            onPress={() => {
              handleSubmit();
            }}
            title="Submit"
          />
        </Container>
      )}
    </Formik>
  );
}
