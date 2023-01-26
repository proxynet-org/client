import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, useTheme } from '@rneui/themed';
import { InputForm, SafeAreaView, SubmitButtonForm, View } from 'components';
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
    <SafeAreaView className="flex-1 justify-center px-6">
      <View className="mb-7">
        <Text h1>{i18n.t('auth.forgotPassword.title')}</Text>
        <Text>{i18n.t('auth.forgotPassword.subTitle')}</Text>
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
      <SubmitButtonForm
        title="auth.forgotPassword.button"
        handleSubmit={handleSubmit}
        errors={errors}
      />

      <View className="flex-row justify-center mb-7">
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
    </SafeAreaView>
  );
}
