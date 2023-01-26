import { Text, useTheme } from '@rneui/themed';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AuthTabParams } from 'navigation';
import { useFormik } from 'formik';

import { SigninSchema } from 'schemas';
import { InputForm, SubmitButtonForm, View, SafeAreaView } from 'components';
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
    <SafeAreaView className="flex-1 justify-center px-6">
      <View className="mb-7">
        <Text h1>{i18n.t('auth.signin.title')}</Text>
        <Text bold>{i18n.t('auth.signin.subTitle')}.</Text>
      </View>

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
        <Text
          style={{
            color: theme.colors.primary,
            marginBottom: 28,
            textAlign: 'center',
          }}
        >
          {i18n.t('auth.signin.forgotPassword')}
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center mb-7">
        <Text>{i18n.t('auth.signin.noAccount')} </Text>
        <TouchableOpacity onPress={() => navigation.jumpTo('SignupScreen')}>
          <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
            {i18n.t('auth.signup.button')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
