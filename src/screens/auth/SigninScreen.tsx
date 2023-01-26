import { Text, useTheme } from '@rneui/themed';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AuthTabParams } from 'navigation';
import { useFormik } from 'formik';

import { SigninSchema } from 'schemas';
import { InputForm, SubmitButtonForm, View } from 'components';
import i18n from 'languages';
import { useAuth } from 'hooks';

export function SigninScreen() {
  const { theme } = useTheme();
  const { signIn } = useAuth();
  const navigation = useNavigation<BottomTabNavigationProp<AuthTabParams>>();

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldTouched,
    values,
    errors,
    touched,
  } = useFormik({
    initialValues: { email: '', password: '' },
    onSubmit: signIn,
    validationSchema: SigninSchema,
    validateOnMount: true,
  });

  return (
    <View className="flex-1 items-center justify-center p-5">
      <View className="w-full p-5">
        <Text h1>{i18n.t('auth.signin.title')}</Text>
        <Text bold>{i18n.t('auth.signin.subTitle')}.</Text>
      </View>

      <View className="w-full items-center justify-center">
        <InputForm
          name="email"
          values={values}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
          handleBlur={handleBlur}
          setFieldTouched={setFieldTouched}
          leftIconName="email-outline"
          placeholder="EMAIL"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
        />
        <InputForm
          name="password"
          values={values}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
          handleBlur={handleBlur}
          setFieldTouched={setFieldTouched}
          leftIconName="lock-outline"
          placeholder="PASSWORD"
          secureTextEntry={true}
          autoComplete="password"
          textContentType="password"
        />
        <SubmitButtonForm
          title="auth.signin.button"
          errors={errors}
          handleSubmit={handleSubmit}
        />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SigninStack', {
              screen: 'ForgotPasswordScreen',
              params: { email: values.email },
            })
          }
        >
          <Text style={{ color: theme.colors.primary, marginVertical: 10 }}>
            {i18n.t('auth.signin.forgotPassword')}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="w-full flex-row items-center justify-center">
        <Text>{i18n.t('auth.signin.noAccount')} </Text>
        <TouchableOpacity onPress={() => navigation.jumpTo('SignupScreen')}>
          <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
            {i18n.t('auth.signup.button')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
