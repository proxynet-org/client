import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, useTheme } from '@rneui/themed';
import { InputForm, SubmitButtonForm, View } from 'components';
import { useFormik } from 'formik';
import i18n from 'languages';
import { AuthTabParams, SigninStackParams } from 'navigation';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ForgotPasswordSchema } from 'schemas';

export function ForgotPasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthTabParams>>();
  const route = useRoute<RouteProp<SigninStackParams>>();
  const { theme } = useTheme();

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldTouched,
    values,
    errors,
    touched,
  } = useFormik({
    initialValues: { email: route.params?.email || '' },
    onSubmit: console.log,
    validationSchema: ForgotPasswordSchema,
    validateOnMount: true,
  });

  return (
    <View className="flex-1 items-center justify-center p-5">
      <View className="w-full p-5">
        <Text h1>{i18n.t('auth.forgotPassword.title')}</Text>
        <Text>{i18n.t('auth.forgotPassword.subTitle')}</Text>
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
        <SubmitButtonForm
          title="auth.forgotPassword.button"
          handleSubmit={handleSubmit}
          errors={errors}
        />
      </View>

      <View className="w-full flex-row items-center justify-center">
        <Text>{i18n.t('auth.signin.noAccount')} </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            navigation.navigate('SignupScreen');
          }}
        >
          <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
            {i18n.t('auth.signup.button')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
