import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Text, useTheme } from '@rneui/themed';
import { FormInput, View } from 'components';
import { Formik } from 'formik';
import { AuthTabParams } from 'navigation';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ForgotPasswordSchema } from 'schemas';

export function ForgotPasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthTabParams>>();
  const { theme } = useTheme();

  return (
    <View className="flex-1 items-center justify-center p-5">
      <View className="w-full p-5">
        <Text h1>Forgot your password ?</Text>
        <Text>
          Enter your email or phone and we&apos;ll send you a link to get back
          to your account
        </Text>
      </View>
      <Formik
        initialValues={{ email: '' }}
        onSubmit={console.log}
        validationSchema={ForgotPasswordSchema}
        validateOnMount={true}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldTouched,
          values,
          errors,
          touched,
        }) => (
          <View className="w-full items-center justify-center">
            <FormInput
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
            <Button
              buttonStyle={{
                width: 250,
                height: 75,
              }}
              containerStyle={{ borderRadius: 50 }}
              title="Send Login Link"
              titleProps={{ style: { fontWeight: 'bold', fontSize: 20 } }}
              onPress={() => handleSubmit()}
              disabled={Object.keys(errors).length > 0}
            />
          </View>
        )}
      </Formik>
      <View className="w-full flex-row items-center justify-center">
        <Text>Don&apos;t have an account ? </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            navigation.navigate('SignupScreen');
          }}
        >
          <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
