import { Button, Text, useTheme } from '@rneui/themed';
import { TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthTabParams } from 'navigation';
import { Formik } from 'formik';

import { SigninSchema } from 'schemas';
import { FormInput, View } from 'components';
import i18n from 'languages';

export function SigninScreen() {
  const navigation = useNavigation<NavigationProp<AuthTabParams>>();

  const { theme } = useTheme();

  return (
    <View className="flex-1 items-center justify-center p-5">
      <View className="w-full p-5">
        <Text h1>{i18n.t('Signin')}</Text>
        <Text bold>Please signin to continue.</Text>
      </View>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={(values) => console.log(values)}
        validationSchema={SigninSchema}
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
            <FormInput
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
            <Button
              buttonStyle={{
                width: 250,
                height: 75,
              }}
              containerStyle={{ borderRadius: 50 }}
              title={i18n.t('Signin')}
              titleProps={{ style: { fontWeight: 'bold', fontSize: 20 } }}
              onPress={() => {
                handleSubmit();
              }}
              disabled={Object.keys(errors).length > 0}
            />
            <TouchableOpacity>
              <Text style={{ color: theme.colors.primary }}>
                Forgot Password ?
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      <View className="w-full flex-row items-center justify-center">
        <Text>Don&apos;t have an account ? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
          <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
